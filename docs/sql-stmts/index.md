# SQL Statements Index

## Access Method

- [CREATE ACCESS METHOD](./create-access-method.md) - Defines a new access method.
- [DROP ACCESS METHOD](./drop-access-method.md) - Removes an access method.

## Cast

- [CREATE CAST](./create-cast.md) - Defines a new cast.
- [DROP CAST](./drop-cast.md) - Removes a cast.

## Collation

- [CREATE COLLATION](./create-collation.md) - Defines a new collation.
- [ALTER COLLATION](./alter-collation.md) - Changes the definition of a collation.
- [DROP COLLATION](./drop-collation.md) - Removes a previously defined collation.

## Conversion

- [CREATE CONVERSION](./create-conversion.md) - Defines a new encoding conversion.
- [ALTER CONVERSION](./alter-conversion.md) - Changes the definition of a conversion.
- [DROP CONVERSION](./drop-conversion.md) - Removes a conversion.

## Cursor

- [DECLARE](./declare.md) - Defines a cursor.
- [CLOSE](./close.md) - Closes a cursor.
- [FETCH](./fetch.md) - Retrieves rows from a query using a cursor.
- [MOVE](./move.md) - Positions a cursor.
- [RETRIEVE](./retrieve.md) - Retrieves rows from a query using a parallel retrieve cursor.

## Database

- [CREATE DATABASE](./create-database.md) - Creates a new database.
- [ALTER DATABASE](./alter-database.md) - Changes the attributes of a database.
- [DROP DATABASE](./drop-database.md) - Removes a database.
- [ANALYZE](./analyze.md) - Collects statistics about a database.
- [VACUUM](./vacuum.md) - Garbage-collects and optionally analyzes a database.
- [CHECKPOINT](./checkpoint.md) - Forces a write-ahead log checkpoint.
- [COMMENT](./comment.md) - Defines or changes the comment of an object.
- [COPY](./copy.md) - Copies data between a file and a table.
- [LOAD](./load.md) - Loads or reloads a shared library file.

## Domain

- [CREATE DOMAIN](./create-domain.md) - Defines a new domain.
- [ALTER DOMAIN](./alter-domain.md) - Changes the definition of a domain.
- [DROP DOMAIN](./drop-domain.md) - Removes a domain.

## Extension

- [CREATE EXTENSION](./create-extension.md) - Registers an extension in a Cloudberry Database.
- [ALTER EXTENSION](./alter-extension.md) - Change the definition of an extension.
- [DROP EXTENSION](./drop-extension.md) - Removes an extension from a Cloudberry Database.

## External Table

- [CREATE EXTERNAL TABLE](./create-external-table.md) - Defines a new external table.
- [ALTER EXTERNAL TABLE](./alter-external-table.md) - Changes the definition of an external table.
- [DROP EXTERNAL TABLE](./drop-external-table.md) - Removes an external table definition.

## Foreign Data Wrapper

- [CREATE FOREIGN DATA WRAPPER](./create-foreign-data-wrapper.md) - Defines a new foreign-data wrapper.
- [ALTER FOREIGN DATA WRAPPER](./alter-foreign-data-wrapper.md) - Changes the definition of a foreign-data wrapper.
- [DROP FOREIGN DATA WRAPPER](./drop-foreign-data-wrapper.md) - Removes a foreign-data wrapper.

## Function & Aggregate Function

### Function

- [CREATE FUNCTION](./create-function.md) - Defines a new function.
- [ALTER FUNCTION](./alter-function.md) - Changes the definition of a function.
- [DROP FUNCTION](./drop-function.md) - Removes a function.

### Aggregate Function

- [CREATE AGGREGATE](./create-aggregate.md) - Defines a new aggregate function.
- [ALTER AGGREGATE](./alter-aggregate.md) - Changes the definition of an aggregate function.
- [DROP AGGREGATE](./drop-aggregate.md) - Removes an aggregate function.

## Foreign Table

- [CREATE FOREIGN TABLE](./create-foreign-table.md) - Defines a new foreign table.
- [ALTER FOREIGN TABLE](./alter-foreign-table.md) - Changes the definition of a foreign table.
- [DROP FOREIGN TABLE](./drop-foreign-table.md) - Removes a foreign table.

## User & Group

- [CREATE ROLE](./create-role.md) - Defines a new database role (user or group).
- [ALTER ROLE](./alter-role.md) - Changes a database role (user or group).
- [SET ROLE](./set-role.md) - Sets the current role identifier of the current session.
- [DROP ROLE](./drop-role.md) - Removes a database role.
- [CREATE USER](./create-user.md) - Defines a new database role.
- [ALTER USER](./alter-user.md) - Changes the definition of a database role.
- [DROP USER](./drop-user.md) - Removes a database role.
- [CREATE GROUP](./create-group.md) - Defines a new database role.
- [ALTER GROUP](./alter-group.md) - Changes a role name or membership.
- [DROP GROUP](./drop-group.md) - Removes a database role.
- [DROP OWNED](./drop-owned.md) - Removes database objects owned by a database role.
- [REASSIGN OWNED](./reassign-owned.md) - Changes the ownership of database objects owned by a database role.

## Index

- [CREATE INDEX](./create-index.md) - Defines a new index.
- [ALTER INDEX](./alter-index.md) - Changes the definition of an index.
- [REINDEX](./reindex.md) - Rebuilds indexes.
- [DROP INDEX](./drop-index.md) - Removes an index.

## Notification

- [NOTIFY](./notify.md) - Generates a notification.
- [LISTEN](./listen.md) - Listens for a notification.
- [UNLISTEN](./unlisten.md) - Stops listening for a notification.

## Procedural Language

- [CREATE LANGUAGE](./create-language.md) - Defines a new procedural language.
- [ALTER LANGUAGE](./alter-language.md) - Changes the definition of a procedural language.
- [DROP LANGUAGE](./drop-language.md) - Removes a procedural language.
- [DO](./do.md) - Runs anonymous code block as a transient anonymous function.

## View and Materialized View

- [CREATE VIEW](./create-view.md) - Defines a new view.
- [ALTER VIEW](./alter-view.md) - Changes properties of a view.
- [DROP VIEW](./drop-view.md) - Removes a view.
- [CREATE MATERIALIZED VIEW](./create-materialized-view.md) - Defines a new materialized view.
- [ALTER MATERIALIZED VIEW](./alter-materialized-view.md) - Changes the definition of a materialized view.
- [DROP MATERIALIZED VIEW](./drop-materialized-view.md) - Removes a materialized view.
- [REFRESH MATERIALIZED VIEW](./refresh-materialized-view.md) - Replaces the contents of a materialized view.

## Operator & Operator Class & Operator Family

### Operator

- [CREATE OPERATOR](./create-operator.md) - Defines a new operator.
- [ALTER OPERATOR](./alter-operator.md) - Changes the definition of an operator.
- [DROP OPERATOR](./drop-operator.md) - Removes an operator.

### Operator Class

- [CREATE OPERATOR CLASS](./create-operator-class.md) - Defines a new operator class.
- [ALTER OPERATOR CLASS](./alter-operator-class.md) - Changes the definition of an operator class.
- [DROP OPERATOR CLASS](./drop-operator-class.md) - Removes an operator class.

### Operator Family

- [CREATE OPERATOR FAMILY](./create-operator-family.md) - Defines a new operator family.
- [ALTER OPERATOR FAMILY](./alter-operator-family.md) - Changes the definition of an operator family.
- [DROP OPERATOR FAMILY](./drop-operator-family.md) - Removes an operator family.

## Privilege & Security

### Privilege

- [GRANT](./grant.md) - Defines access privileges.
- [ALTER DEFAULT PRIVILEGES](./alter-default-privileges.md) - Changes default access privileges.
- [REVOKE](./revoke.md) - Removes access privileges.

### Row-level Security Policy

- [CREATE POLICY](./create-policy.md) - Defines a new row-level security policy for a table.
- [ALTER POLICY](./alter-policy.md) - Changes the definition of a row-level security policy.
- [DROP POLICY](./drop-policy.md) - Removes a row-level security policy from a table.

## Procedure

- [CREATE PROCEDURE](./create-procedure.md) - Defines a new procedure.
- [ALTER PROCEDURE](./alter-procedure.md) - Changes the definition of a procedure.
- [DROP PROCEDURE](./drop-procedure.md) - Removes a procedure.
- [CALL](./call.md) - Invokes a procedure.

## Protocol

- [CREATE PROTOCOL](./create-protocol.md) - Registers a custom data access protocol that can be specified when defining a Cloudberry Database external table.
- [ALTER PROTOCOL](./alter-protocol.md) - Changes the definition of a protocol.
- [DROP PROTOCOL](./drop-protocol.md) - Removes a data access protocol from a database.

## Resource Management

### Resource Group

- [CREATE RESOURCE GROUP](./create-resource-group.md) - Defines a new resource group.
- [ALTER RESOURCE GROUP](./alter-resource-group.md) - Changes the limits of a resource group.
- [DROP RESOURCE GROUP](./drop-resource-group.md) - Removes a resource group.

### Resource Queue

- [CREATE RESOURCE QUEUE](./create-resource-queue.md) - Defines a new resource queue.
- [ALTER RESOURCE QUEUE](./alter-resource-queue.md) - Changes the limits of a resource queue.
- [DROP RESOURCE QUEUE](./drop-resource-queue.md) - Removes a resource queue.

## Routine

- [ALTER ROUTINE](./alter-routine.md) - Changes the definition of a routine.
- [DROP ROUTINE](./drop-routine.md) - Removes a routine.

## Rule

- [CREATE RULE](./create-rule.md) - Defines a new rewrite rule.
- [ALTER RULE](./alter-rule.md) - Changes the definition of a rule.
- [DROP RULE](./drop-rule.md) - Removes a rewrite rule.

## Row

- [INSERT](./insert.md) - Creates new rows in a table.
- [SELECT](./select.md) - Retrieves rows from a table or view.
- [UPDATE](./update.md) - Updates rows of a table.
- [VALUES](./values.md) - Computes a set of rows.

## Schema

- [CREATE SCHEMA](./create-schema.md) - Defines a new schema.
- [ALTER SCHEMA](./alter-schema.md) - Changes the definition of a schema.
- [DROP SCHEMA](./drop-schema.md) - Removes a schema.

## Sequence

- [CREATE SEQUENCE](./create-sequence.md) - Defines a new sequence generator.
- [ALTER SEQUENCE](./alter-sequence.md) - Changes the definition of a sequence generator.
- [DROP SEQUENCE](./drop-sequence.md) - Removes a sequence.

## Session

- [SET SESSION AUTHORIZATION](./set-session-authorization.md) - Sets the session role identifier and the current role identifier of the current session.
- [DISCARD](./discard.md) - Discards the session state.

## Foreign Server

- [CREATE SERVER](./create-server.md) - Defines a new foreign server.
- [ALTER SERVER](./alter-server.md) - Changes the definition of a foreign server.
- [DROP SERVER](./drop-server.md) - Removes a foreign server descriptor.
- [CREATE USER MAPPING](./create-user-mapping.md) - Defines a new mapping of a user to a foreign server.
- [ALTER USER MAPPING](./alter-user-mapping.md) - Changes the definition of a user mapping for a foreign server.
- [DROP USER MAPPING](./drop-user-mapping.md) - Removes a user mapping for a foreign server.

## Statistics Object

- [CREATE STATISTICS](./create-statistics.md) - Defines extended statistics.
- [ALTER STATISTICS](./alter-statistics.md) - Changes the definition of an extended statistics object.
- [DROP STATISTICS](./drop-statistics.md) - Removes extended statistics.

## Table

- [CREATE TABLE](./create-table.md) - Defines a new table.
- [ALTER TABLE](./alter-table.md) - Changes the definition of a table.
- [DROP TABLE](./drop-table.md) - Removes a table.
- [CLUSTER](./cluster.md) - Physically reorders a table on disk according to an index.
- [CREATE TABLE AS](./create-table-as.md) - Defines a new table from the results of a query.
- [DELETE](./delete.md) - Deletes rows from a table
- [TRUNCATE](./truncate.md) - Empties a table or set of tables of all rows.
- [IMPORT FOREIGN SCHEMA](./import-foreign-schema.md) - Imports table definitions from a foreign server.
- [SELECT INTO](./select-into.md) - Defines a new table from the results of a query.

## Tablespace

- [CREATE TABLESPACE](./create-tablespace.md) - Defines a new tablespace.
- [ALTER TABLESPACE](./alter-tablespace.md) - Changes the definition of a tablespace.
- [DROP TABLESPACE](./drop-tablespace.md) - Removes a tablespace.

## Text Search

### Text Search Configuration

- [CREATE TEXT SEARCH CONFIGURATION](./create-text-search-configuration.md) - Defines a new text search configuration.
- [ALTER TEXT SEARCH CONFIGURATION](./alter-text-search-configuration.md) - Changes the definition of a text search configuration.
- [DROP TEXT SEARCH CONFIGURATION](./drop-text-search-configuration.md) - Removes a text search configuration.

### Text Search Dictionary

- [CREATE TEXT SEARCH DICTIONARY](./create-text-search-dictionary.md) - Defines a new text search dictionary.
- [ALTER TEXT SEARCH DICTIONARY](./alter-text-search-dictionary.md) - Changes the definition of a text search dictionary.
- [DROP TEXT SEARCH DICTIONARY](./drop-text-search-dictionary.md) - Removes a text search dictionary.

### Text Search Parser

- [CREATE TEXT SEARCH PARSER](./create-text-search-parser.md) - Defines a new text search parser.
- [ALTER TEXT SEARCH PARSER](./alter-text-search-parser.md) - Changes the definition of a text search parser.
- [DROP TEXT SEARCH PARSER](./drop-text-search-parser.md) - Removes a text search parser.

### Text Search Template

- [CREATE TEXT SEARCH TEMPLATE](./create-text-search-template.md) - Defines a new text search template.
- [ALTER TEXT SEARCH TEMPLATE](./alter-text-search-template.md) - Changes the definition of a text search template.
- [DROP TEXT SEARCH TEMPLATE](./drop-text-search-template.md) - Removes a text search template.

## Transform

- [CREATE TRANSFORM](./create-transform.md) - Defines a new transform.
- [DROP TRANSFORM](./drop-transform.md) - Removes a transform.
  
## Trigger

- [CREATE TRIGGER](./create-trigger.md) - Defines a new trigger.
- [ALTER TRIGGER](./alter-trigger.md) - Changes the definition of a trigger.
- [DROP TRIGGER](./drop-trigger.md) - Removes a trigger.

## Data Type

- [CREATE TYPE](./create-type.md) - Defines a new data type.
- [ALTER TYPE](./alter-type.md) - Changes the definition of a data type.
- [DROP TYPE](./drop-type.md) - Removes a data type.

## Transaction

- [BEGIN](./begin.md) - Starts a transaction block.
- [ABORT](./abort.md) - Terminates the current transaction.
- [COMMIT](./commit.md) - Commits the current transaction.
- [END](./end.md) - Commits the current transaction.
- [ROLLBACK](./rollback.md) - Stops the current transaction.
- [START TRANSACTION](./start-transaction.md) - Starts a transaction block.
- [SET TRANSACTION](./set-transaction.md) - Sets the characteristics of the current transaction.
- [SAVEPOINT](./savepoint.md) - Defines a new savepoint within the current transaction.
- [RELEASE SAVEPOINT](./release-savepoint.md) - Destroys a previously defined savepoint.
- [ROLLBACK TO SAVEPOINT](./rollback-to-savepoint.md) - Rolls back the current transaction to a savepoint.
- [LOCK](./lock.md) - Locks a table.
- [SET CONSTRAINTS](./set-constraints.md) - Sets constraint check timing for the current transaction.

## Configuration Parameter

- [SET](./set.md) - Changes the value of a run-time Cloudberry Database configuration parameter.
- [RESET](./reset.md) - Restores the value of a run-time system configuration parameter to the default value.
- [SHOW](./show.md) - Shows the value of a run-time system configuration parameter.

## SQL Statement

- [PREPARE](./prepare.md) - Prepares a statement for execution.
- [DEALLOCATE](./deallocate.md) - Deallocates a prepared statement.
- [EXECUTE](./execute.md) - Runs a prepared SQL statement.
- [EXPLAIN](./explain.md) - Shows the query plan of a statement.
