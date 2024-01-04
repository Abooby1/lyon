# Redirects
* [Client](https://github.com/Abooby1/lyon/blob/main/README.md)
* [Changelog](https://github.com/Abooby1/lyon/blob/main/Docs/changelog.md)
* [Posts](https://github.com/Abooby1/lyon/blob/main/Docs/posts.md)
* Chats (*)
* [Users](https://github.com/Abooby1/lyon/blob/main/Docs/users.md)
* [Groups](https://github.com/Abooby1/lyon/blob/main/Docs/groups.md)
* [Polls](https://github.com/Abooby1/lyon/blob/main/Docs/polls.md)

# Chat Parameters
* `Chat.id` - Get the chats id.
* `Chat.postid` - Get the chats postid.
* `Chat.replyid` - Get the chats reply id, if replied.
* `Chat.created` - Get when the chat was made in timestamp.
* `Chat.author()` - Get the chats author as User.
* `Chat.edit({string})` - Edit the chat.
	* {string} - New chat text.
* `Chat.delete()` - Delete the chat.
* `Chat.reply({string})` - Reply to the chat.
	* {string} - Reply text.
* `Chat.onDelete({function})` - Listen for when the chat is deleted.
	* {function} - The function called when the chat is deleted.
* `Chat.onEdit({function})` - Listen for when the chat is edited.
	* {function} - The function called when the chat is edited.
* `Chat.disconnect({array})` - Disconnect a listener.
	* {array} - Array given from a listener.
* `Chat.report()` - Report the chat. (incomplete)