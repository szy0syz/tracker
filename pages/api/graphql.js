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
