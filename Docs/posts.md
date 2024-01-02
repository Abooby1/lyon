# Redirects
* [Client](https://github.com/Abooby1/lyon/blob/main/README.md)
* [Changelog](https://github.com/Abooby1/lyon/blob/main/Docs/changelog.md)
* Posts (*)
* [Chats (incomplete)](https://github.com/Abooby1/lyon/blob/main/Docs/chats.md)
* [Users](https://github.com/Abooby1/lyon/blob/main/Docs/users.md)
* [Groups (incomplete)](https://github.com/Abooby1/lyon/blob/main/Docs/groups.md)
* [Polls](https://github.com/Abooby1/lyon/blob/main/Docs/polls.md)

# Starter Code
```
client.onPost(async (post) => {
	let author = await post.author()

	if(author.name == "Abooby") {
		post.chat("Hey Abooby!")
	}
})
```

# Post Parameters
* `Post.id` - Get the posts id.
* `Post.groupid` - Get the posts groupid if any.
* `Post.content` - Get the posts content.
* `Post.created` - Get the timestamp on when the post was created.
* `Post.media` - Get an array containing links redirecting to each post image.
* `Post.likes` - Get the amount of likes the post has.
* `Post.quotes` - Get the amount of quotes the post has.
* `Post.chats` - Get the amount of chats the post has.
* `Post.author()` - Get the posts author.
* `Post.onChat({function})` - Listen for chats on the post.
	* {function} - Function that will be called when a chat is made.
* `Post.onDelete({function})` - Listen for when the post is deleted.
	* {function} - Function that will be called when the post is deleted.
* `Post.onEdit({function})` - Listen for when the post is edited.
	* {function} - Function that will be called when the post is edited.
* `Post.disconnect({array})` - Disconect a listener. (incomplete)
	* {array} - The array any listener param returns.
* `Post.chat({string})` - Chat in the post.
	* {string} - The text of the chat.
* `Post.edit({string})` - Edit the post.
	* {string} - The new text of the post.
* `Post.delete()` - Delete the post.
* `Post.like()` - Like the post.
* `Post.unlike()` - Unlike the post.
* `Post.pin()` - Pin the post.
* `Post.unpin()` - Unpin the post.
* `Post.poll()` - If the post has a poll, return the poll data.
* `Post.report()` - Report the post. (incomplete)