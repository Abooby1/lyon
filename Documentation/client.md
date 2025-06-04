# Client Class
<pre>export class Client</pre>

### The Client class initiates a connection to an account.

---------
<details>
  <summary><strong>Properties</strong></summary>

  <strong>readonly</strong> `data` : [`UserControl`](user.md) | [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)
  <br>> User data of the bot.

  <strong>readonly</strong> `mention` : [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  <br>> Returns the mention of the bot.
</details>

<details>
  <summary><strong>Methods</strong></summary>

  `onReady` (func: [***Function***](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)) : [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)
  <br>> Run a function when the bot is fully initialized.
</details>