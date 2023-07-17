/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  docsbars: [

    {
      type: 'category',
      label: 'Introduction',
      items: ['cbdb-overview','cbdb-architecture','cbdb-scenarios','cbdb-vs-gp-features']
     },

    {
      type: 'category',
      label: 'Deployment Guides',
      items: ['cbdb-op-software-hardware',
      {
        type: 'category',
        label: 'Physical Machine Deployment',
        items: ['cbdb-op-deploy-arch','cbdb-op-deploy-guide']
      }]
    },

    {
      type: 'category',
      label: 'SQL References',
      items: [
      {
        type: 'category',
        label: 'SQL Statements',
        items: [
        'sql-statements/sql-statement-abort',
        'sql-statements/sql-statement-alter-aggregate',
        'sql-statements/sql-statement-alter-conversion',
        'sql-statements/sql-statement-alter-database',
        'sql-statements/sql-statement-alter-external-table',
        'sql-statements/sql-statement-alter-function',
        'sql-statements/sql-statement-alter-domain'
        ]
       }
      ]
    },

  ]
}

module.exports = sidebars;
