/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import { create } from 'jss';
import React from 'react';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Layout from './src/components/Layout';
import './src/style.css';

const jss = create({
  ...jssPreset(),
  // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
  insertionPoint: document.getElementById('jss-insertion-point'),
});

export const wrapRootElement = ({ element }) => {
  return <StylesProvider jss={jss}>{element}</StylesProvider>;
};

// TODO: Handle this intelligently
export const shouldUpdateScroll = () => false;

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
