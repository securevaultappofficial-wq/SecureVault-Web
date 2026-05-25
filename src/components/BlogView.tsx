/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export default function BlogView() {
  return (
    <section className="bg-cyber-bg min-h-screen">
      <iframe
        title="SecureVault Blogs"
        src="/blog/"
        className="block w-full min-h-[calc(100vh-112px)] border-0 bg-black"
      />
    </section>
  );
}
