/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Không tìm thấy trang</Header>
          <TitleAndMetaTags title="React - Không tìm thấy trang" />
          <div css={sharedStyles.markdown}>
            <p>Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.</p>
            <p>
              Vui lòng liên hệ với chủ sở hữu của trang web đã liên kết với URL
              gốc và cho họ biết liên kết của họ bị hỏng.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
