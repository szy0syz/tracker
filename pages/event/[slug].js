import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const Event = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      <h1>{slug}</h1>
    </Layout>
  );
};

export default Event;
