import { CommonProvider } from './contexts/common/commonContext';
import Header from './components/common/Header';
import RouterRoutes from './routes/RouterRoutes';
import Footer from './components/common/Footer';
import BackTop from './components/common/BackTop';


const App = () => {
  return (
    <>
      <CommonProvider>
        <Header />
        <RouterRoutes />
        <Footer />
        <BackTop />
      </CommonProvider>
    </>
  );
};

export default App;