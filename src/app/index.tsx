import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Root Entry Point Redirector.
 * Instantly routes the user down to the primary Tab layout 
 * once the application boot-strapping finishes execution.
 */
export default function RootIndex() {
  return <Redirect href="/(tabs)/picture" />;
}