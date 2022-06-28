import type { NextPage } from "next";

import Container from "../components/Container";

const Home: NextPage = () => {
  return (
    <>
      <Container background="hero-light-1" className="py-12">
        <h3 className="mb-2">🇲🇾 Malaysia's data at your fingertips!</h3>
        <p className="max-w-3xl text-dim">
          A whole-of-government effort led by the Department of Statistics
          (DOSM) to democratise data, institutionalise transparency, and put
          Malaysia at the forefront of data-driven decision-making.
        </p>
      </Container>
      <Container className="min-h-screen"> </Container>
    </>
  );
};

export default Home;
