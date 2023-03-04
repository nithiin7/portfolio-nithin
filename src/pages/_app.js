import PropTypes from 'prop-types';
import Layout from 'components/layouts/Layout';
import 'styles/globals.scss';

export default function App({ Component, pageProps }) {
  return (
    <Layout { ...pageProps }>
      <Component { ...pageProps } />
    </Layout>
  )
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
}