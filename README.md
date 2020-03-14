# tracker

> a next.js demo

## Notes

### 关于 'next/head'

- 注意啊，这里 `<Head>` 处理的是 `html` 文档的 `head` 标签内容

```js
import Head from 'next/head';

const Layouts = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  );
};
```

### perfetch

```js
<Link perfetch={false} href="/about">
  <a>About</a>
</Link>
```

### 取路由的 query

```js
// pages/event/[id].js
import { useRouter } from 'next/router';

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h1>{id}</h1>
    </Layout>
  );
};
```

### 关于 api 请求集成

```js
// pages/api/graphql.js
export default (req, res) => {
  // 简写
  res.status(200).json({
    test: 'hello @@',
  });

  // res.setHeader('Content-Type', 'application/json');
  // res.statusCode = 200;
  // res.end(
  //   JSON.stringify({
  //     test: 'hello @@@',
  //   })
  // );
};
```
