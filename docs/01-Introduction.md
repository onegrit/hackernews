# React + Apollo Tutorial - Introduction

**Note:** The final project for this tutorial can be found on [GitHub](https://github.com/howtographql/react-apollo). You can always use it as a reference whenever you get lost throughout   the course of the following chapters. Also note that each code block is  annotated with a filename. These annotations directly link to the   corresponding file on GitHub, so you can clearly see where to put the   code and what the end result will look like.

### 

### Overview

In the previous tutorials, you learned about major  concepts and  benefits of GraphQL. Now is the time to get your hands  dirty and start  out with an actual project!

You’re going to build a simple clone of [Hackernews](https://news.ycombinator.com/). Here’s a list of the features the app will have:

- Display a list of links 显示链接列表
- Search the list of links 搜索链接列表
- Users can authenticate 需要认证用户身份
- Authenticated users can create new links 经过认证的用户可以创建新链接
- Authenticated users can upvote links (one vote per link and user)  经过身份认证的用户可以投票链接（每个用户只能投票一次链接
- Realtime updates when other users upvote a link or create a new one 当其他用户投票一个链接或创建一个新的链接时事实通知用户

In this track, you’ll use the following technologies for building the app:

- Frontend:

  - [React](https://facebook.github.io/react/): Frontend framework for building user interfaces
  - [Apollo Client 2.1](https://github.com/apollographql/apollo-client): Production-ready, caching GraphQL client


- Backend:

  - [`graphql-yoga`](https://github.com/prisma/graphql-yoga/): Fully-featured GraphQL Server with focus on easy setup, performance & great developer experience
  - [Prisma](https://www.prisma.io/): Open-source GraphQL API layer that turns your database into a GraphQL API

  You’ll create the React project with [`create-react-app`](https://github.com/facebookincubator/create-react-app), a popular command-line tool that gives you a blank project with all required build configuration already setup.

### 

### Why a GraphQL Client?

In the [Clients](https://www.howtographql.com/advanced/0-clients/) section in the GraphQL part, we already covered the responsibilities of a GraphQL client on a higher level, now it’s time to get more concrete.

In short, you should use a GraphQL client for tasks that are  repetitive and agnostic to the app you’re building. For example,  being  able to send queries and mutations without having to worry about   lower-level networking details or maintaining a local cache. This is   functionality you’ll want in any frontend application that’s talking to a GraphQL server - why build it yourself when you can use one of the   amazing GraphQL clients out there?  简而言之，您应该使用GraphQL客户端执行与您所构建的应用程序无关的重复性任务。  例如，能够发送查询和修改而不必担心较低级别的网络详细信息或维护本地缓存。  在与GraphQL服务器通信的任何前端应用程序中都需要使用此功能-当您可以使用其中一个出色的GraphQL客户端之一时，为什么要自己构建它呢（重新造轮子）？

There are a few GraphQL client libraries available, that all give you varying degrees of control over ongoing GraphQL operations and come  with various different benefits and drawbacks. For very simple use cases (such as writing scripts), [`graphql-request`](https://github.com/prisma/graphql-request) might already be enough for your needs. Libraries like it are thin  layers around sending HTTP requests to your GraphQL API.  有一些GraphQL客户端库可供使用，它们都使您可以对正在进行的GraphQL操作进行不同程度的控制，并具有各种不同的优点和缺点。  对于非常简单的用例（例如编写脚本），[`graphql-request`]（https://github.com/prisma/graphql-request）可能已经足够满足您的需求。 像这样的库是围绕将HTTP请求发送到GraphQL API的薄层。

Chances are that you’re writing a somewhat larger  application where  you want to benefit from caching, optimistic UI  updates and other handy features. In these cases you’ll likely want to  use a full GraphQL  client that handles the lifecycle of all your GraphQL operations. You  have the choice between [Apollo Client](https://github.com/apollographql/apollo-client), [Relay](https://facebook.github.io/relay/), and [urql](https://github.com/FormidableLabs/urql). 您可能正在编写一个更大的应用程序，希望从中受益于缓存，乐观的UI更新和其他方便的功能。 在这种情况下，您可能需要使用完整的GraphQL客户端来处理所有GraphQL操作的生命周期。 您可以在[Apollo Client]（https://github.com/apollographql/apollo-client），[Relay]（https://facebook.github.io/relay/）和[urql]（https： //github.com/FormidableLabs/urql）。


### Apollo vs Relay vs urql

The most common question heard from people that are  getting started  with GraphQL on the frontend is which GraphQL client  they should use.  We’ll try to provide a few hints that’ll help you  decide which of these clients is the right one for your next project!  前端使用GraphQL的人们最常听到的问题是应该使用哪个GraphQL客户端。 我们将尝试提供一些提示，帮助您确定哪些客户适合您的下一个项目！

[Relay](https://facebook.github.io/relay/)  is Facebook’s homegrown GraphQL client that they open-sourced alongside  GraphQL in 2015. It incorporates all the learnings that Facebook   gathered since they started using GraphQL in 2012. Relay is heavily   optimized for performance and tries to reduce network traffic where   possible. An interesting side-note is that Relay itself actually started out as a *routing* framework that  eventually got combined with  data loading responsibilities. It thus  evolved into a powerful data  management solution that can be used in  JavaScript apps to interface  with GraphQL APIs. [Relay]（https://facebook.github.io/relay/）是Facebook的GraphQL客户端，于2015年与GraphQL一起开源。它整合了Facebook自2012年开始使用GraphQL以来收集到的所有知识。 针对性能进行了大幅优化，并在可能的情况下尝试减少网络流量。 一个有趣的旁注是，Relay本身实际上是作为一个* routing  *框架开始的，最终与数据加载职责结合在一起。 因此，它演变为功能强大的数据管理解决方案，可在JavaScript应用程序中使用以与GraphQL API进行接口。

The performance benefits of Relay come at the cost of a  notable  learning curve. Relay is a pretty complex framework and  understanding  all its bits and pieces does require some time to really  get into it.  The overall situation in that respect has improved with the release of  the 1.0 version, called [Relay Modern](http://facebook.github.io/relay/docs/en/introduction-to-relay.html), but if you’re looking for something to *just get started* with GraphQL, Relay might not be the right choice just yet.  Relay的性能优势是以学习曲线为代价的。 中继是一个非常复杂的框架，了解中继的所有点点滴滴确实需要一些时间才能真正进入中继。  在这方面，随着称为[Relay Modern]（http://facebook.github.io/relay/docs/en/introduction-to-relay.html）的1.0版本的发布，总体情况有所改善。 如果正在寻找可以“开始”使用GraphQL的功能，那么Relay可能还不是正确的选择。

[Apollo Client](https://github.com/apollographql/apollo-client) is a community-driven effort to build an easy-to-understand, flexible   and powerful GraphQL client. Apollo has the ambition to build one   library for every major development platform that people use to build   web and mobile applications. Right now there is a JavaScript client with bindings for popular frameworks like [React](https://github.com/apollographql/react-apollo), [Angular](https://github.com/apollographql/apollo-angular), [Ember](https://github.com/bgentry/ember-apollo-client) or [Vue](https://github.com/Akryum/vue-apollo) as well as early versions of [iOS](https://github.com/apollographql/apollo-ios) and [Android](https://github.com/apollographql/apollo-android) clients. Apollo is production-ready and has handy features like  caching, optimistic UI, subscription support and many more. [Apollo客户端]（https://github.com/apollographql/apollo-client）是由社区驱动的工作，目的是建立一个易于理解，灵活而强大的GraphQL客户端。 Apollo的目标是为人们用来构建Web和移动应用程序的每个主要开发平台构建一个库。 现在有一个JavaScript客户端，它带有流行框架框架的绑定，例如[React]（https://github.com/apollographql/react-apollo），[Angular]（https://github.com/apollographql/apollo-angular） ，[Ember]（https://github.com/bgentry/ember-apollo-client）或[Vue]（https://github.com/Akryum/vue-apollo）以及[iOS]的早期版本（ https://github.com/apollographql/apollo-ios）和[Android]（https://github.com/apollographql/apollo-android）客户端。 Apollo已投入生产，并具有诸如缓存，乐观的UI，订阅支持等便捷功能。

[urql](https://github.com/FormidableLabs/urql) is a more  dynamic approach on GraphQL clients and a newer project  compared to  Relay and Apollo. While it’s highly focused on React, at its core it  focuses on simplicity and extensibility. It comes with the  barebones to build an efficient GraphQL client, but gives you full  control over how it processes GraphQL operations and results via  “Exchanges”. Together  with the first-party exchange [`@urql/exchange-graphcache`](https://github.com/FormidableLabs/urql-exchange-graphcache) it is basically equivalent in functionality with Apollo, but with a smaller footprint and a very focused API.  [urql]（https://github.com/FormidableLabs/urql）是一种相对于Relay和Apollo在GraphQL客户端上更动态的方法，并且是一个较新的项目。 尽管它高度关注React，但其核心却专注于简单性和可扩展性。 它具有构建高效GraphQL客户端的准系统，但使您可以完全控制其如何通过“交易所”处理GraphQL操作和结果。 与第一方交换[`@ urql / exchange-graphcache`]（https://github.com/FormidableLabs/urql-exchange-graphcache）一起，它在功能上基本上与Apollo等效，但是占用空间更小，并且 非常集中的API。