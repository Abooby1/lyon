# Redirects
* [Client](https://github.com/Abooby1/lyon/blob/main/README.md)
* [Changelog](https://github.com/Abooby1/lyon/blob/main/Docs/changelog.md)
* [Posts](https://github.com/Abooby1/lyon/blob/main/Docs/posts.md)
* [Chats (incomplete)](https://github.com/Abooby1/lyon/blob/main/Docs/chats.md)
* [Users](https://github.com/Abooby1/lyon/blob/main/Docs/users.md)
* [Groups (incomplete)](https://github.com/Abooby1/lyon/blob/main/Docs/groups.md)
* Polls (*)

# Poll Parameters
* `Poll.title` - Get the polls title.
* `Poll.options` - Get an array of poll options.
* `Poll.votes` - Get an array of poll votes.
* `Poll.totalVotes` - Get the total amount of votes on the poll.
* `Poll.alreadyVoted` - Check if you have already voted.
* `Poll.onVote({function})` - Listen for when the poll is voted on.
	* {function} - Function that will be called when the poll is voted on.
* `Poll.vote({number})` - Cast a vote on the poll.
	* {number} - The index (0-3) of the option youre voting.

# Poll Vote Parameters
* `Poll.vote` - Get the vote number.
* `Poll.change` - Get the change of the vote. Either -1 or 1.
* `Poll.author()` - Get the author of the vote.