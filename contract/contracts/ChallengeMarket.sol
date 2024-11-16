// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title ChallengeMarket
 * @notice A challenge market where users can create goals and others can challenge them
 * The challenge price follows a bonding curve, and rewards are distributed based on the goal outcome
 */
contract ChallengeMarket is Ownable, ReentrancyGuard {
    using Math for uint256;

    // --- Type declarations ---
    struct Goal {
        string id;
        uint256 endTime;
        address creator;
        bool isResolved;
        bool result;
        uint256 totalChallenges;
        uint256 totalValue;
        mapping(address => uint256) challengeCount;
    }

    // --- State variables ---
    mapping(string => Goal) public goals;
    mapping(string => bool) public goalExists;

    uint256 public constant MIN_INITIAL_STAKE = 0.1 ether;
    uint256 public constant SLOPE = 2e12;
    uint256 public constant MAX_CHALLENGES = 50;

    // --- Events ---
    event GoalCreated(
        string indexed id,
        uint256 endTime,
        address indexed creator,
        uint256 initialStake
    );
    event GoalChallenged(
        string indexed id,
        address indexed challenger,
        uint256 amount,
        uint256 cost
    );
    event GoalResolved(string indexed id, bool result, uint256 totalValue);
    event PayoutClaimed(
        string indexed id,
        address indexed recipient,
        uint256 amount
    );

    // --- Modifiers ---
    modifier goalExists_(string memory _id) {
        require(goalExists[_id], "Goal does not exist");
        _;
    }

    modifier goalNotExpired(string memory _id) {
        require(block.timestamp < goals[_id].endTime, "Goal has expired");
        _;
    }

    modifier goalNotResolved(string memory _id) {
        require(!goals[_id].isResolved, "Goal already resolved");
        _;
    }

    modifier goalIsResolved(string memory _id) {
        require(goals[_id].isResolved, "Goal not resolved yet");
        _;
    }

    // --- External functions ---
    function createGoal(string memory _id, uint256 _endTime) external payable {
        require(!goalExists[_id], "Goal already exists");
        require(_endTime > block.timestamp, "End time must be in future");
        require(msg.value >= MIN_INITIAL_STAKE, "Insufficient initial stake");

        Goal storage newGoal = goals[_id];
        newGoal.id = _id;
        newGoal.endTime = _endTime;
        newGoal.creator = msg.sender;
        newGoal.totalValue = msg.value;

        goalExists[_id] = true;

        emit GoalCreated(_id, _endTime, msg.sender, msg.value);
    }

    function challenge(
        string memory _id,
        uint256 _amount
    )
        external
        payable
        goalExists_(_id)
        goalNotExpired(_id)
        goalNotResolved(_id)
        nonReentrant
    {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            _amount <= MAX_CHALLENGES,
            "Exceeds maximum challenges allowed"
        );

        uint256 cost = calculateChallengePrice(_id, _amount);
        require(msg.value >= cost, "Insufficient payment");

        Goal storage goal = goals[_id];
        goal.challengeCount[msg.sender] += _amount;
        goal.totalChallenges += _amount;
        goal.totalValue += cost;

        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit GoalChallenged(_id, msg.sender, _amount, cost);
    }

    function resolveGoal(
        string memory _id,
        bool _result
    ) external onlyOwner goalExists_(_id) goalNotResolved(_id) {
        require(
            block.timestamp >= goals[_id].endTime,
            "Goal has not expired yet"
        );

        Goal storage goal = goals[_id];
        goal.isResolved = true;
        goal.result = _result;

        emit GoalResolved(_id, _result, goal.totalValue);
    }

    function claimPayout(
        string memory _id
    ) external goalExists_(_id) goalIsResolved(_id) nonReentrant {
        Goal storage goal = goals[_id];
        uint256 userChallenges = goal.challengeCount[msg.sender];
        require(userChallenges > 0, "No challenges to claim");

        uint256 payout;
        if (goal.result) {
            require(
                msg.sender == goal.creator,
                "Only creator can claim on success"
            );
            payout = goal.totalValue;
        } else {
            payout = (goal.totalValue * userChallenges) / goal.totalChallenges;
        }

        goal.challengeCount[msg.sender] = 0;

        payable(msg.sender).transfer(payout);

        emit PayoutClaimed(_id, msg.sender, payout);
    }

    // --- External view functions ---
    function getChallengePrice(
        string memory _id
    ) external view goalExists_(_id) returns (uint256) {
        Goal storage goal = goals[_id];
        return getCurrentPrice(goal.totalChallenges);
    }

    function getUserChallenges(
        string memory _id,
        address _user
    ) external view goalExists_(_id) returns (uint256) {
        return goals[_id].challengeCount[_user];
    }

    function getGoalInfo(
        string memory _id
    )
        external
        view
        goalExists_(_id)
        returns (
            uint256 endTime,
            address creator,
            bool isResolved,
            bool result,
            uint256 totalChallenges,
            uint256 totalValue
        )
    {
        Goal storage goal = goals[_id];
        return (
            goal.endTime,
            goal.creator,
            goal.isResolved,
            goal.result,
            goal.totalChallenges,
            goal.totalValue
        );
    }

    // --- Public view functions ---
    function getCurrentPrice(uint256 supply) public pure returns (uint256) {
        return SLOPE * supply * supply;
    }

    function calculateChallengePrice(
        string memory _id,
        uint256 _amount
    ) public view goalExists_(_id) returns (uint256) {
        Goal storage goal = goals[_id];
        uint256 startSupply = goal.totalChallenges;
        uint256 endSupply = startSupply + _amount;

        return calculateAreaUnderCurve(startSupply, endSupply);
    }

    // --- Internal pure functions ---
    function calculateAreaUnderCurve(
        uint256 startSupply,
        uint256 endSupply
    ) internal pure returns (uint256) {
        uint256 endArea = (SLOPE * endSupply * endSupply * endSupply) / 3;
        uint256 startArea = (SLOPE * startSupply * startSupply * startSupply) /
            3;
        return endArea - startArea;
    }
}
