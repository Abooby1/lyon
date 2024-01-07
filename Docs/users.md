# Redirects
* [Client](https://github.com/Abooby1/lyon/blob/main/README.md)
* [Changelog](https://github.com/Abooby1/lyon/blob/main/Docs/changelog.md)
* [Posts](https://github.com/Abooby1/lyon/blob/main/Docs/posts.md)
* [Chats](https://github.com/Abooby1/lyon/blob/main/Docs/chats.md)
* Users (*)
* [Groups](https://github.com/Abooby1/lyon/blob/main/Docs/groups.md)
* [Polls](https://github.com/Abooby1/lyon/blob/main/Docs/polls.md)

# User Parameters
* `User.id` - Get the users id.
* `User.name` - Get the users name.
* `User.roles` - Get an array containing the users roles.
* `User.picture` - Get the users profile picture.
* `User.banner` - Get the users profile banner.
* `User.followers` - Get the number of people following the user.
* `User.following` - Get the number of people the user is following.
* `User.bio` - Get the users bio.
* `User.visibility` - Get the users visibility.
* `User.status` - Get the users status.
* `User.premium` - Get an object containing data of the users premium subscription.
* `User.pinned()` - Get the users pinned post.
* `User.follow()` - Follow the user.
* `User.unfollow()` - Unfollow the user.
* `User.block()` - Block the user.
* `User.unblock()` - Unblock the user.
* `User.followersParsed()` - Get an array containing the users followers.
* `User.followingParsed()` - Get an array containing the users followings.
* `User.kick()` - If the user is in a group, kick the user.
* `User.ban({object})` - Ban the user. (two instances)
	* Instance 1: If the user isnt in a group, a normal ban request will be sent. This will need the {object}
  * Instance 2: If the user is in a group, they will get banned from the group.
  * {object} - { length: {number} | "Permanent", reason: {string}, terminate: {boolean} }
* `User.report({object})` - Report the user.
	* {object} - { reason: {string}, report: {string} }