// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPermit2 {
    struct TokenPermissions {
        address token; // ERC20 token address
        uint256 amount; // Amount allowed
    }

    struct PermitTransferFrom {
        TokenPermissions permitted;
        uint256 nonce;
        uint256 deadline;
    }

    struct SignatureTransferDetails {
        address to;
        uint256 requestedAmount;
    }

    function permitTransferFrom(
        PermitTransferFrom calldata permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;
}

/**
 * @title ChallengeMarket
 * @notice A challenge market where users can create goals and others can challenge them
 * The challenge price follows a bonding curve, and rewards are distributed based on the goal outcome
 */
contract ChallengeMarket is Ownable, ReentrancyGuard {
    using Math for uint256;

    // --- Type declarations ---
    struct Goal {
        uint256 goalId;
        string title;
        string description;
        uint256 endTime;
        address creator;
        bool isResolved;
        bool result;
        uint256 totalChallenges;
        uint256 totalValue;
        mapping(address => uint256) challengeCount;
    }

    // --- State variables ---
    mapping(uint256 => Goal) public goals;
    mapping(uint256 => bool) public goalExists;
    uint256 public nextGoalId = 1;

    uint256 public constant MIN_INITIAL_STAKE = 10 ** 15;
    uint256 public constant SLOPE = 2e12;
    uint256 public constant MAX_CHALLENGES = 50;
    address public constant SUPPORTED_TOKEN =
        0x2cFc85d8E48F8EAB294be644d9E25C3030863003;
    IPermit2 public permit2;
    IERC20 public token = IERC20(SUPPORTED_TOKEN);

    // --- Events ---
    event GoalCreated(
        uint256 indexed goalId,
        string title,
        string description,
        uint256 endTime,
        address indexed creator,
        uint256 initialStake
    );
    event GoalChallenged(
        uint256 indexed goalId,
        address indexed challenger,
        uint256 amount,
        uint256 cost
    );
    event GoalResolved(uint256 indexed goalId, bool result, uint256 totalValue);
    event PayoutClaimed(
        uint256 indexed goalId,
        address indexed recipient,
        uint256 amount
    );

    // --- Modifiers ---
    modifier goalExists_(uint256 _id) {
        require(goals[_id].goalId != 0, "Goal does not exist");
        _;
    }

    modifier goalNotExpired(uint256 _id) {
        require(block.timestamp < goals[_id].endTime, "Goal has expired");
        _;
    }

    modifier goalNotResolved(uint256 _id) {
        require(!goals[_id].isResolved, "Goal already resolved");
        _;
    }

    modifier goalIsResolved(uint256 _id) {
        require(goals[_id].isResolved, "Goal not resolved yet");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {
        permit2 = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);
    }

    // --- External functions ---
    function createGoal(
        string memory _title,
        string memory _description,
        uint256 _endTime,
        uint256 _nonce,
        uint256 _deadline,
        bytes calldata permitSignature
    ) external payable {
        uint256 goalId = nextGoalId;
        nextGoalId++; // Increment goalId for the next goal
        require(_endTime > block.timestamp, "End time must be in future");

        if (permitSignature.length > 0) {
            permit2.permitTransferFrom(
                IPermit2.PermitTransferFrom({
                    permitted: IPermit2.TokenPermissions({
                        token: SUPPORTED_TOKEN,
                        amount: MIN_INITIAL_STAKE
                    }),
                    nonce: _nonce,
                    deadline: _deadline
                }),
                IPermit2.SignatureTransferDetails({
                    to: address(this),
                    requestedAmount: MIN_INITIAL_STAKE
                }),
                msg.sender,
                permitSignature
            );
        } else {
            revert("No Permit2 signature provided");
        }

        Goal storage newGoal = goals[goalId];
        newGoal.goalId = goalId;
        newGoal.title = _title;
        newGoal.description = _description;
        newGoal.endTime = _endTime;
        newGoal.creator = msg.sender;
        newGoal.totalValue = MIN_INITIAL_STAKE;

        goalExists[goalId] = true;

        emit GoalCreated(
            goalId,
            _title,
            _description,
            _endTime,
            msg.sender,
            MIN_INITIAL_STAKE
        );
    }

    function challenge(
        uint256 _id,
        uint256 _amount,
        uint256 _nonce,
        uint256 _deadline,
        bytes calldata permitSignature
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
        if (permitSignature.length > 0) {
            permit2.permitTransferFrom(
                IPermit2.PermitTransferFrom({
                    permitted: IPermit2.TokenPermissions({
                        token: SUPPORTED_TOKEN,
                        amount: cost
                    }),
                    nonce: _nonce,
                    deadline: _deadline
                }),
                IPermit2.SignatureTransferDetails({
                    to: address(this),
                    requestedAmount: cost
                }),
                msg.sender,
                permitSignature
            );
        } else {
            revert("No Permit2 signature provided");
        }

        Goal storage goal = goals[_id];
        goal.challengeCount[msg.sender] += _amount;
        goal.totalChallenges += _amount;
        goal.totalValue += cost;

        emit GoalChallenged(_id, msg.sender, _amount, cost);
    }

    function resolveGoal(
        uint256 _id,
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
        uint256 _id
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
            if (goal.totalChallenges == 0) {
                // No challenges, owner can claim
                require(
                    owner() == msg.sender,
                    "Only owner can claim when no challenges"
                );
                payout = goal.totalValue;
            } else {
                // Distribute based on user challenges
                require(userChallenges > 0, "No challenges to claim");
                payout = Math.mulDiv(
                    goal.totalValue,
                    userChallenges,
                    goal.totalChallenges
                );
            }
        }

        goal.challengeCount[msg.sender] = 0;

        token.transfer(msg.sender, payout);

        emit PayoutClaimed(_id, msg.sender, payout);
    }

    // --- External view functions ---
    function getClaimableAmount(
        uint256 _id,
        address _user
    ) external view goalExists_(_id) returns (uint256) {
        Goal storage goal = goals[_id];
        uint256 userChallenges = goal.challengeCount[_user];

        if (userChallenges == 0) {
            return 0;
        }

        if (!goal.isResolved) {
            return 0;
        }

        if (goal.result) {
            if (_user == goal.creator) {
                return goal.totalValue;
            }
            return 0;
        } else {
            return
                Math.mulDiv(
                    goal.totalValue,
                    userChallenges,
                    goal.totalChallenges
                );
        }
    }

    function getChallengePrice(
        uint256 _id
    ) external view goalExists_(_id) returns (uint256) {
        Goal storage goal = goals[_id];
        return getCurrentPrice(goal.totalChallenges);
    }

    function getUserChallenges(
        uint256 _id,
        address _user
    ) external view goalExists_(_id) returns (uint256) {
        return goals[_id].challengeCount[_user];
    }

    function getGoalInfo(
        uint256 _id
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
        return Math.mulDiv(SLOPE, supply * supply, 1);
    }

    function calculateChallengePrice(
        uint256 _id,
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
        uint256 endArea = Math.mulDiv(
            Math.mulDiv(SLOPE * endSupply, endSupply * endSupply, 1),
            1,
            3
        );
        uint256 startArea = Math.mulDiv(
            Math.mulDiv(SLOPE * startSupply, startSupply * startSupply, 1),
            1,
            3
        );
        if (endArea > startArea) {
            return endArea - startArea;
        }
        return 0;
    }
}
