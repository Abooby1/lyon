# Redirects
* [Client](https://github.com/Abooby1/lyon/blob/main/README.md)
* [Changelog](https://github.com/Abooby1/lyon/blob/main/Docs/changelog.md)
* [Posts](https://github.com/Abooby1/lyon/blob/main/Docs/posts.md)
* [Chats](https://github.com/Abooby1/lyon/blob/main/Docs/chats.md)
* [Users](https://github.com/Abooby1/lyon/blob/main/Docs/users.md)
* Groups (*)
* [Polls](https://github.com/Abooby1/lyon/blob/main/Docs/polls.md)

# Group Parameters
* `Group.id` - Get the groups id.
* `Group.name` - Get the groups name.
* `Group.icon` - Get the groups icon.
* `Group.created` - Get when the group was created as a timestamp.
* `Group.owner()` - Get the groups owner as User.
* `Group.members()` - Get the groups members as User.
* `Group.moderators()` - Get the groups moderators as User.
* `Group.invites()` - Get the groups invites.
* `Group.post({string}, {object})` - Post in the group.
	* {string} - Post text.
  * {object} - { images: {array}, poll: { title: {string}, options: {array} } }
* `Group.edit({object})` - Edit the groups settings.
	* {object} - { name: {string}, invite: {string}, image: {string} }
* `Group.invite({string})` - Invite a user.
	* {string} - Userid of the user.
* `Group.leave()` - Leave the group.
* `Group.onPost()` - Listen for posts in the group.

# Group Invite Parameters
* `Invite.group()` - Get the group the invite is for.
* `Invite.accept()` - Accept the invite.
* `Invite.revoke()` - Revoke the invite.