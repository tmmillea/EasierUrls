import React from 'react';
import TestRenderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import EasierViewer from './EasierViewer';

Enzyme.configure({adapter: new Adapter()})
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
  const wrapper = Enzyme.mount(<EasierViewer/>);
  act(() => {
    wrapper.update();
  })
  expect(toJson(wrapper)).toMatchSnapshot();
  wrapper.unmount();
});
