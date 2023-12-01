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
      label: 'Deploy and Build',
      items: [
      {
        type: 'category',
        label: 'Build from Source Code',
        items: ['cbdb-macos-compile','cbdb-linux-compile']
      },
      {
        type: 'category',
        label: 'Deploy on Physical Machine',
        items: ['cbdb-op-software-hardware', 'cbdb-op-prepare-to-deploy', 'cbdb-op-deploy-guide']
      }
     ]
    },

    {
      type: 'category',
      label: 'Create and Prepare',
      items: ['create-and-manage-database','start-and-stop-cbdb-database','connect-to-cbdb']
     },

     {
      type: 'category',
      label: 'Operate with Data',
      items: ['basic-query-syntax','create-and-manage-tables','insert-update-delete-rows','work-with-transactions','transactional-concurrency-control']
     },

     {
      type: 'category',
      label: 'Optimize Query Performance',
      items: ['query-performance-overview', 'update-stats-using-analyze']
     },

    {
      type: 'category',
      label: 'References',
      items: [
      {
        type: 'category',
        label: 'SQL Statements',
        items: [
          'sql-stmts/sql-stmt-abort',
          'sql-stmts/sql-stmt-alter-database',
          'sql-stmts/sql-stmt-alter-rule',
          'sql-stmts/sql-stmt-alter-tablespace',
          'sql-stmts/sql-stmt-create-database',
          'sql-stmts/sql-stmt-create-index',
          'sql-stmts/sql-stmt-create-tablespace',
          'sql-stmts/sql-stmt-drop-database',
          'sql-stmts/sql-stmt-drop-extension',
          'sql-stmts/sql-stmt-drop-external-table',
          'sql-stmts/sql-stmt-drop-index',
          'sql-stmts/sql-stmt-drop-materialized-view',
          'sql-stmts/sql-stmt-drop-role',
          'sql-stmts/sql-stmt-drop-rule',
          'sql-stmts/sql-stmt-drop-schema',
          'sql-stmts/sql-stmt-drop-table',
          'sql-stmts/sql-stmt-drop-tablespace',
          'sql-stmts/sql-stmt-drop-type',
          'sql-stmts/sql-stmt-drop-user',
          'sql-stmts/sql-stmt-drop-view',
          'sql-stmts/sql-stmt-end',
          'sql-stmts/sql-stmt-rollback',
          'sql-stmts/sql-stmt-rollback-to-savepoint',
          'sql-stmts/sql-stmt-savepoint',
          'sql-stmts/sql-stmt-set-role',
          'sql-stmts/sql-stmt-set-transaction',
          'sql-stmts/sql-stmt-start-transaction',
          'sql-stmts/sql-stmt-truncate',
        ]
      },
     ]
    },

  ]
}

module.exports = sidebars;

