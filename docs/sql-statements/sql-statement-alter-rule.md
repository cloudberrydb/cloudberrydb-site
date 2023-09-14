# ALTER RULE

Changes the definition of a rule.

## Synopsis

``` {#sql_command_synopsis}
ALTER RULE name ON <table_name> RENAME TO <new_name>
```

## Description

`ALTER RULE` changes properties of an existing rule. Currently, the only available action is to change the rule's name.

To use `ALTER RULE`, you must own the table or view that the rule applies to.

## Parameters

name
:   The name of an existing rule to alter.

table\_name
:   The name \(optionally schema-qualified\) of the table or view that the rule applies to.

new\_name
:   The new name for the rule.

## Examples

To rename an existing rule:

```
ALTER RULE notify_all ON emp RENAME TO notify_me; 
```

## Compatibility

`ALTER RULE` is a Greenplum Database extension, as is the entire query rewrite system.

## See Also

[CREATE RULE](CREATE_RULE.html), [DROP RULE](DROP_RULE.html)

**Parent topic:** [SQL Commands](../sql_commands/sql_ref.html)
