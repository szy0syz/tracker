import { useRouter } from 'next/router';
import Layout from '../../components/Layouts';

const Event = () => {
  const router = useRouter();
  const { slug } = router.query;
  console.log(router);
  return (
    <Layout>
      <h1>{slug}</h1>
    </Layout>
  );
};

export default Event;
