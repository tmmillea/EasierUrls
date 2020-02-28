import React from 'react';
import TestRenderer from 'react-test-renderer';
import EasierViewer from './EasierViewer';
const {act} = TestRenderer;
test('empty snapshot', () => {
  const render = TestRenderer.create(<EasierViewer/>);
  expect(render.toJSON()).toMatchSnapshot();
  render.unmount();
});
test('Initialized', async () => {
  const urlList = {
    smallUrlList: [
    {
      urlPath: "VhQLtXr9h4YW",
      data: {
        target: "https://google.com",
        remaining: 10,
      }
    },
    {
      urlPath: "1sODnR6Vtcbd",
      data: {
        target: "https://intuit.com",
        remaining: 10,
      }
    },
    {
      urlPath: "fQTC51Aagwfj",
      data: {
        target: "https://amazon.com",
        remaining: 10,
      }
    },]
  };
  fetchMock.mockResponse(JSON.stringify(urlList));
  let wrapper;
  await act(() => {
    wrapper = TestRenderer.create(<EasierViewer/>);
  })
  expect(wrapper.toJSON()).toMatchSnapshot();
  wrapper.unmount();
});
