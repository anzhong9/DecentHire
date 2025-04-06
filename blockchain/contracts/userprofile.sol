// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract UserProfile {
    struct User {
        string name;
        string image;
        string about;
        string mail;
        string twitter;
        string github;
    }

    mapping(address => User) public users;

    event UserProfileUpdated(address indexed user);

    function updateUserProfile(
        string memory _name,
        string memory _about,
        string memory _image,
        string memory _mail,
        string memory _twitter,
        string memory _github
    ) external {
        users[msg.sender] = User({
            name: _name,
            about: _about,
            image: _image,
            mail: _mail,
            twitter: _twitter,
            github: _github
        });

        emit UserProfileUpdated(msg.sender);
    }

    function getUserProfile(address _userAddress) external view returns (
        string memory, string memory, string memory, string memory, string memory, string memory
    ) {
        User memory user = users[_userAddress];
        return (user.name, user.image, user.about, user.mail, user.twitter, user.github);
    }
}
