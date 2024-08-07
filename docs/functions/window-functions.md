---
title: Window Functions
---

# Window Functions in Cloudberry Database

The following are Cloudberry Database built-in window functions. All window functions are *immutable*.<!-- For more information about window functions, see "Window Expressions" in the *Cloudberry Database Administrator Guide*. -->

|Function|Return Type|Full Syntax|Description|
|--------|-----------|-----------|-----------|
|`cume_dist()`|`double precision`|`CUME_DIST() OVER ( [PARTITION BY` expr `] ORDER BY` expr `)`|Calculates the cumulative distribution of a value in a group of values. Rows with equal values always evaluate to the same cumulative distribution value.|
|`dense_rank()`|`bigint`|`DENSE_RANK () OVER ( [PARTITION BY` expr `] ORDER BY` expr `)`|Computes the rank of a row in an ordered group of rows without skipping rank values. Rows with equal values are given the same rank value.|
|`first_value(*expr*)`|same as input expr type|`FIRST_VALUE(` expr `) OVER ( [PARTITION BY` expr `] ORDER BY` expr `[ROWS\|RANGE` frame_expr `] )`|Returns the first value in an ordered set of values.|
|`lag(*expr* [,*offset*] [,*default*])`|same as input *expr* type|`LAG(` *expr* `[,` *offset* `] [,` *default* `]) OVER ( [PARTITION BY` *expr* `] ORDER BY` *expr* `)`|Provides access to more than one row of the same table without doing a self join. Given a series of rows returned from a query and a position of the cursor, `LAG` provides access to a row at a given physical offset prior to that position. The default `offset` is 1. *default* sets the value that is returned if the offset goes beyond the scope of the window. If *default* is not specified, the default value is null.|
|`last_value(*expr*)`|same as input *expr* type|`LAST_VALUE(*expr*) OVER ( [PARTITION BY *expr*] ORDER BY *expr* [ROWS\|RANGE *frame_expr*] )`|Returns the last value in an ordered set of values.|
|``lead(*expr* [,*offset*] [,*default*])``|same as input *expr* type|`LEAD(*expr*[,*offset*] [,*expr**default*]) OVER ( [PARTITION BY *expr*] ORDER BY *expr* )`|Provides access to more than one row of the same table without doing a self join. Given a series of rows returned from a query and a position of the cursor, `lead` provides access to a row at a given physical offset after that position. If *offset* is not specified, the default offset is 1. *default* sets the value that is returned if the offset goes beyond the scope of the window. If *default* is not specified, the default value is null.|
|`ntile(*expr*)`|`bigint`|`NTILE(*expr*) OVER ( [PARTITION BY *expr*] ORDER BY *expr* )`|Divides an ordered data set into a number of buckets (as defined by *expr*) and assigns a bucket number to each row.|
|`percent_rank()`|`double precision`|`PERCENT_RANK () OVER ( [PARTITION BY *expr*] ORDER BY *expr*)`|Calculates the rank of a hypothetical row `R` minus 1, divided by 1 less than the number of rows being evaluated (within a window partition).|
|`rank()`|`bigint`|`RANK () OVER ( [PARTITION BY *expr*] ORDER BY *expr*)`|Calculates the rank of a row in an ordered group of values. Rows with equal values for the ranking criteria receive the same rank. The number of tied rows are added to the rank number to calculate the next rank value. Ranks may not be consecutive numbers in this case.|
|`row_number()`|`bigint`|`ROW_NUMBER () OVER ( [PARTITION BY *expr*] ORDER BY *expr*)`|Assigns a unique number to each row to which it is applied (either each row in a window partition or each row of the query).|
