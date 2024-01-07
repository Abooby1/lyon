# Lyon
A smart Photop Client made by @Abooby! Use it to make Photop bots that interacts with a fun community!
Make sure to join the [Lyon Group](https://app.photop.live/?j=ebe4376e) to get extra help, report bugs, or suggest features!

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
* The Client class is the most important class needed for the bot.
  * Keep note that all "images" are directories leading to the image. For example: "./cat.png"

## Starter Code
```
import { Client } from "lyon";

const Client = await new Client({
	userid: "bot_userid",
	token: "bot_token",
	config: { // Fully optional
		GroupConnections: < boolean | default:true > // If true, will listen for group posts with a normal Client.onPost()
	},
	onReady: <function> // Will run the function when the bot is connected and ready
})
```

## Client Parameters
* `Client.selfData` - Get your account data.
* `Client.post({string}, {object})` - Post into the home page. If groupid given, post into the group.
	* {string} - Text of the post
  * {object} - { images: {array}, poll: { title: {string}, options: {array} }, groupid: {string} }
* `Client.onPost({function}, {object})` - Listen for posts.
	* {function} - The function called when a new post is created.
  * {object} - { groupid: {string} }
* `Client.onInvite({function})` - Listen for group invites.
	* {function} - The function called when your invited to a group.
* `Client.getPosts({object})` - Get an array of posts with terms.
  * {object} - { id: {string}, userid: {string}, groupid: {string}, before: "{timestamp}", after: "{timestamp}" }
* `Client.getChats({object})` - Get an array of chats with terms.
  * {object} - { id: {string}, userid: {string}, postid: {string}, groupid: {string}, before: "{timestamp}", after: "{timestamp}" }
* `Client.getUsers({object})` - Get an array of users with terms.
   * {object} - { id: {string}, term: {string}, name: {string} }
* `Client.getGroups({object})` - Get an array of groups with terms.
	* {object} - { id: {string}, before: "{timestamp}", after: "{timestamp}" }
* `Client.getBlocked()` - Get an array of all your blocked users.
* `Client.getInvites()` - Get an array of all your group invites.
* `Client.createGroup({object})` - Create a group.
	* {object} - { name: {string}, invite: {string}, image: {directory} }
* `Client.joinGroup({object})` - Join a group.
	* {object} - { groupid: {string}, code: {string} }
* `Client.leaveGroup({string})` - Leave a group.
	* {string} - GroupID.
* `Client.deletePost({string})` - Delete a post.
	* {string} - PostID.
* `Client.deleteChat({string})` - Delete a chat.
	* {string} - ChatID.
* `Client.updateBio({string})` - Update your bio.
	* {string} - New bio.
* `Client.updateName({string})` - Update your name.
	* {string} - New name.
* `Client.updateVisibility({string})` - Update your visibility.
	* {string} - New visibility.
* `Client.updatePicture({string})` - Update your profile picture.
	* {string} - Directory to new profile picture.
* `Client.updateBanner({string})` - Update your profile banner.
	* {string} - Directory to new banner.
* `Client.unban({string})` - Unban a user.
	* {string} - UserID.