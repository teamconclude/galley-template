---
title: Home
description: A starter site for Hugo, edited with Galley.
blocks:
  - component: hero
    title: Welcome to your new site
    text: >-
      This page is built from **blocks**. Open it in Galley to change the text,
      reorder the blocks or add new ones.
    image: /images/hero.png
    buttons:
      component: button-row
      alignment: left
      buttons:
        - component: button
          label: About this site
          url: /about/
          style: primary
          newTab: false
        - component: button
          label: Read the blog
          url: /blog/
          style: secondary
          newTab: false
  - component: section
    title: How it fits together
    body: |-
      Each block names a component in `components/`. The component's schema
      tells Galley which fields to show, and its template renders the block.

      Pages without blocks, like the [blog posts](/blog/), are plain Markdown.
    points:
      - Write in Markdown or fill in forms
      - See every change in the live preview
      - Publish through git
    background: white
  - component: image-with-text
    image: /images/workspace.png
    alt: A sketch of a page with a heading, three lines of text and a button
    text: |-
      ### Make it yours

      Replace the placeholder images in `static/images/`, change the colours in
      `assets/css/style.css` and add components of your own.
    imageSide: left
    width: 45
    link:
      label: Read about the site
      url: /about/
  - component: faq
    title: Frequently asked questions
    intro: |-
      A few answers to get you started.
      Click a question to open it.
    entries:
      - question: How do I preview the site?
        answer: Run `hugo server` in the site's folder and open the address it prints.
      - question: Where do new components go?
        answer: >-
          In a folder of their own under `components/`, with a schema, a template
          and a stylesheet. The README walks through it.
      - question: Do I need Galley?
        answer: >-
          No. This is an ordinary Hugo site; Galley adds a block editor and a live
          preview on top.
---
