# **Problem Statement**

### 

We've all fallen down the Reddit rabbit hole, haven't we? So, the designers have just shared the latest designs (attached on the next page), and you are tasked to build this page version using React/Vue (preferably), or any framework of your choice. Would you be able to do that?
- You have to make a static page for all the design elements and make it look as close to the design as possible. Pixel Perfect is best.
- Links and buttons on the designs are not supposed to work unless asked for specifically below.
- You need to make the popular section dynamic using the Reddit open APIs
  - [__https://www.reddit.com/dev/api__](https://www.reddit.com/dev/api)
  - [__https://www.reddit.com/r/{subreddit}/{sort}/.json__](https://www.reddit.com/r/%7Bsubreddit%7D/%7Bsort%7D/.json)__?limit={limit}__
- Sort options like hot, new, controversial etc, should make use of the API.
- A subreddit is a Reddit community for a specific topic, named as `r/topic` For example - `r/technology`
- `limit`- limits the number of posts
- Other sections, like the favorites, reddit feeds, etc, are not required to be made dynamic and can be hard coded.
- Making the search work with the API will be a bonus :)
  - [__https://www.reddit.com/search.json?q={query}__](https://www.reddit.com/search.json?q={query})
- Additional Considerations
  - **Pagination:** You may make use of `after` and `before` parameters to navigate through result sets. (optional)
  - **Rate Limiting:** Be mindful of Reddit's API rate limits to avoid being throttled.

# **Expectations**

### 

- **Write quality code** as you would write in a production environment.
- Ensure you **make regular Git commits **to clearly demonstrate your approach and progress over the course of the day. (Required)
- You are free to use any component library and CSS framework if you want. We use multiple things on multiple projects - tailwind, bootstrap, and vanilla CSS. If not sure, lean on plain old CSS and basics and you should be fine. We prefer if you don’t use any CSS framework.
- Do your best to name and arrange files/components/variables as you would in a production-ready application.