# Lyon
A smart Photop Client made by @Abooby! Use it to make Photop bots that interacts with a fun community!

# Redirects
* Clients (*)
* [Changelog](https://github.com/Abooby1/lyon/blob/main/Docs/changelog.md)
* [Posts](https://github.com/Abooby1/lyon/blob/main/Docs/posts.md)
* [Chats](https://github.com/Abooby1/lyon/blob/main/Docs/chats.md)
* [Users](https://github.com/Abooby1/lyon/blob/main/Docs/users.md)
* [Groups](https://github.com/Abooby1/lyon/blob/main/Docs/groups.md)
* [Polls](https://github.com/Abooby1/lyon/blob/main/Docs/polls.md)

# Builds
* [Stable Build](https://www.npmjs.com/package/lyon)
* [Unstable Build](https://github.com/Abooby1/lyon)

# Client Class
* The client class is the most important class needed for the bot.
  * Keep note that all "images" are directories leading to the image. For example: "./cat.png"

## Starter Code
```
import { Client } from "lyon";

const client = await new Client({
	userid: "bot_userid",
	token: "bot_token",
	config: { // Fully optional
		GroupConnections: < boolean | default:true > // If true, will listen for group posts with a normal client.onPost()
	},
	onReady: <function> // Will run the function when the bot is connected and ready
})
```

## Client Parameters
* `client.post("text", {object})` - Post into the home page. If groupid given, post into the group.
	* {object} - { images: {array}, poll: { title: "{string}", options: {array} }, groupid: "{string}" }
* `client.onPost({function}, {optional_object})` - Listen for posts.
  * {optional_object} - { groupid: "{string}" }
* `client.onInvite({function})` - Listen for group invites.
* `client.createGroup()` - Create a group. (incomplete)
* `client.getPosts({object})` - Get an array of posts with terms.
  * {object} - { postid: "{string}", userid: "{string}", groupid: "{string}", before: "{timestamp}", after: "{timestamp}" }
* `client.getChats({object})` - Get an array of chats with terms.
  * {object} - { chatid: "{string}", userid: "{string}", postid: "{string}", groupid: "{string}", before: "{timestamp}", after: "{timestamp}" }
* `client.getUsers({object})` - Get an array of users with terms.
   * {object} - { term: "{string}", name: "{string}", id: "{string}" }
* `client.getGroups({object})` - Get an array of groups with terms.
	* {object} - { groupid: "{string}", before: "{timestamp}", after: "{timestamp}" }
* `client.getBlocked()` - Get an array of all your blocked users.
* `client.getInvites()` - Get an array of all your group invites.
* `client.joinGroup({object})` - Join a group.
	* {object} - { groupid: "{string}", code: "{string}" }
* `client.leaveGroup(groupid)` - Leave a group with a groupid.
* `client.deletePost(postid)` - Delete a post with a postid.
* `client.deleteChat(chatid)` - Delete a chat with a chatid.
* `client.updateBio(newBio)` - Update your bio.
* `client.updateName(newName)` - Update your name.
* `client.updateVisibility(newVisibility)` - Update your visibility.
* `client.updatePicture(newPicture)` - Update your profile picture.
* `client.updateBanner(newBanner)` - Update your profile banner.
* `client.unban(userid)` - Unban a user.