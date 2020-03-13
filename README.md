# tracker

> a next.js demo

## Notes

### 关于 'next/head'

- 注意啊，这里 `<Head>` 处理的是 `html` 文档的 `head` 标签内容

```js
import Head from 'next/head'

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
