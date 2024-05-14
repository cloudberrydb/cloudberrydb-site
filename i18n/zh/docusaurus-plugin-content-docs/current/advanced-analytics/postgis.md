---
title: 地理空间分析
---

# 地理空间分析

[PostGIS](https://postgis.net/) 扩展了 PostgreSQL 的功能，增加了对地理空间数据的存储、索引和查询支持。Cloudberry Database 支持 PostGIS 进行地理空间分析。

本文介绍了如何为你的 Cloudberry Database 集群编译和构建 PostGIS。

要查看 Cloudberry Database PostGIS 项目的仓库，请访问 [`cloudberrydb/postgis`](https://github.com/cloudberrydb/postgis)。该仓库的 PostGIS 是专门为 Cloudberry Database 打造的，本文档介绍的编译构建方法，是基于该仓库的代码。

## 为 Cloudberry Database 编译 PostGIS

在为 Cloudberry Database 安装 PostGIS 之前，请先安装所需的依赖项并编译若干组件。目前，仅支持在 CentOS 系统上进行编译构建，未来计划支持 Rocky Linux。

在开始编译之前，请确保 Cloudberry Database 已正确安装。如果尚未安装，请参阅[文档](https://cloudberrydb.org/zh/docs/)获取安装说明。

1. 安装相关依赖。

    ```bash
    yum install -y libtool proj-devel boost-devel gmp-devel mpfr-devel pcre-devel protobuf protobuf-c protobuf-devel protobuf-c-devel && \
    yum install -y gcc make subversion gcc-c++ sqlite-devel libxml2-devel swig expat-devel libcurl-devel python36-devel json-c
    ```

2. 构建相关组件（GDAL、CGAL、SFCGAL 和 GEOS）。请确保你使用 `root` 用户进行构建。

    1. 构建 GDAL。

        [GDAL](https://gdal.org/index.html) 是一个用于栅格和矢量地理空间数据格式的转换库。按照以下命令进行安装：

        ```bash
        wget https://download.osgeo.org/gdal/2.2.1/gdal-2.2.1.tar.gz --no-check-certificate
        tar xf gdal-2.2.1.tar.gz
        cd gdal-2.2.1/
        ./configure --prefix=/usr/local/gdal-2.2.1
        make && make install
        ```

    2. 构建 CGAL。

        [CGAL](https://www.cgal.org/) 提供了一个 C++ 库，它以一种易于访问的方式提供了高效且可靠的几何算法。按照以下命令进行安装：

        ```bash
        wget https://github.com/CGAL/cgal/archive/releases/CGAL-4.13.tar.gz
        tar xf CGAL-4.13.tar.gz
        cd cgal-releases-CGAL-4.13/
        mkdir build && cd build
        cmake ..
        make && make install
        ```

    3. 构建 SFCGAL。

        [SFCGAL](https://github.com/Oslandia/SFCGAL) 是一个围绕 CGAL 的 C++ 封装库，支持 ISO 19107:2013 和 OGC Simple Features Access 1.2 规范，用于 3D 操作。按照命令进行安装：

        ```bash
        wget https://github.com/Oslandia/SFCGAL/archive/v1.3.6.tar.gz
        tar xf v1.3.6.tar.gz
        cd SFCGAL-1.3.6/
        mkdir build && cd build
        cmake -DCMAKE_INSTALL_PREFIX=/usr/local/sfcgal-1.3.6 ..
        make && make install
        ```

    4. 构建 GEOS。

        [GEOS](https://libgeos.org/) 是一个 C/C++ 计算几何库，专注于地理信息系统 (GIS) 软件中使用的算法。按照以下命令进行安装：

        ```bash
        wget https://download.osgeo.org/geos/geos-3.7.0.tar.bz2 --no-check-certificate
        tar xf geos-3.7.0.tar.bz2
        cd geos-3.7.0/
        ./configure --prefix=/usr/local/geos-3.7.0/
        make && make install
        ```

    5. 更新 `/etc/ld.so.conf`。

        安装上述组件后，更新 `/etc/ld.so.conf` 文件，以配置动态加载器搜索组件的目录。

        ```bash
        cat << EOF >> /etc/ld.so.conf
        /usr/lib/
        /usr/lib64/
        /usr/local/sfcgal-1.3.6/lib64/
        /usr/local/gdal-2.2.1/lib/
        /usr/local/geos-3.7.0/lib/
        EOF
        ```

        然后执行 `ldconfig` 命令。

3. 构建并安装 PostGIS.

    1. 将 `cloudberrydb/postgis` 仓库下载到你的 `/home/gpadmin` 目录中：

        ```bash
        git clone https://github.com/cloudberrydb/postgis.git /home/gpadmin/postgis
        chown -R gpadmin:gpadmin /home/gpadmin/postgis
        ```

    2. 编译 PostGIS。

        在开始编译流程前，执行以下命令，以确保环境变量设置完毕：

            ```bash
            source /usr/local/cloudberrydb/greenplum_path.sh
            source /home/gpadmin/cloudberrydb/gpAux/gpdemo/gpdemo-env.sh
            scl enable devtoolset-10 bash
            source /opt/rh/devtoolset-10/enable
            ```

        然后继续执行以下命令：

        ```bash
        cd /home/gpadmin/postgis/postgis/build/postgis-2.5.4/
        ./autogen.sh
        ./configure --prefix="${GPHOME}" --with-pgconfig="${GPHOME}"/bin/pg_config --with-raster --without-topology --with-gdalconfig=/usr/local/gdal-2.2.1/bin/gdal-config --with-sfcgal=/usr/local/sfcgal-1.3.6/bin/sfcgal-config --with-geosconfig=/usr/local/geos-3.7.0/bin/geos-config
        make && make install
        ```

## 在 Cloudberry Database 中使用 PostGIS

在 Cloudberry Database 集群上编译和加载 PostGIS，并已启动演示集群后，你可以运行以下命令来启用 PostGIS 和支持的扩展：

```sql
$ psql -p 7000 postgres

postgres=# CREATE EXTENSION postgis;     -- 开启 PostGIS 和栅格
postgres=# CREATE EXTENSION fuzzystrmatch;     -- 用于安装 Tiger Geocoder
postgres=# CREATE EXTENSION postgis_tiger_geocoder;     -- 开启 Tiger Geocoder
postgres=# CREATE EXTENSION address_standardizer;     -- 开启 address_standardizer
postgres=# CREATE EXTENSION address_standardizer_data_us;
```

以下示例使用 PostGIS 在数据库中创建非 OpenGIS 表并插入和查询各种几何对象：

```sql
-- 创建一个名为 geom_test 的表。
CREATE TABLE geom_test ( gid int4, geom geometry, 
  name varchar(25) );

-- 向表中插入一行数据，gid 为 1,geometry 字段使用 WKT 格式表示一个三维多边形对象（一个三维正方形）,name 为 '3D Square'。
INSERT INTO geom_test ( gid, geom, name )
  VALUES ( 1, 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))', '3D Square');
  
-- 插入第二行数据，gid 为 2，geometry 为一条三维线串，name 为 '3D Line'。
INSERT INTO geom_test ( gid, geom, name ) 
  VALUES ( 2, 'LINESTRING(1 1 1,5 5 5,7 7 5)', '3D Line' );
  
-- 插入第三行，gid 为 3，geometry 为一个二维多点对象，name 为 '2D Aggregate Point'。
INSERT INTO geom_test ( gid, geom, name )
  VALUES ( 3, 'MULTIPOINT(3 4,8 9)', '2D Aggregate Point' );

-- 先使用 ST_GeomFromEWKT 从 EWKT 构造一个三维线串对象，然后用 Box3D 获取该对象的三维边界框。再使用 && 操作符查询 geom_test 表中的 geom 字段与该边界框相交的所有行。
SELECT * from geom_test WHERE geom &&
  Box3D(ST_GeomFromEWKT('LINESTRING(2 2 0, 3 3 0)'));
```

以下示例使用 PostGIS 创建包含地理参考的表，插入地理编码点数据，以及输出点数据为标准文本格式：

```sql
-- 创建一个名为 geotest 的表。
CREATE TABLE geotest (id INT4, name VARCHAR(32) );

-- 为表 geotest 添加一个名为 geopoint 的 geometry 列，定义为 POINT 点类型，坐标维度为 2，并指定其空间参考系统 (SRID) 为 4326（代表 WGS84 地理坐标系）。
SELECT AddGeometryColumn('geotest','geopoint', 4326,'POINT',2);

-- 插入第一行数据，id 为 1，name 为 'Olympia'，geopoint 是使用 ST_GeometryFromText 从 WKT 文本构造的一个点对象，其坐标为 (-122.90, 46.97)，SRID 为 4326。
INSERT INTO geotest (id, name, geopoint)
  VALUES (1, 'Olympia', ST_GeometryFromText('POINT(-122.90 46.97)', 4326));
  
-- 插入第二行数据，id 为 2，name 为 'Renton'，点坐标为 (-122.22, 47.50)，SRID 同样为 4326。
INSERT INTO geotest (id, name, geopoint)
  VALUES (2, 'Renton', ST_GeometryFromText('POINT(-122.22 47.50)', 4326));

-- 从 geotest 表中选择 name 和 geopoint 字段,但将 geopoint 字段使用 ST_AsText 函数转换为标准文本 (WKT) 格式输出。
SELECT name,ST_AsText(geopoint) FROM geotest;
```

以下示例使用空间索引功能：

```sql
-- 创建表格
CREATE TABLE spatial_data (
  id SERIAL PRIMARY KEY,
  geom geometry
);

-- 插入数据
INSERT INTO spatial_data (geom) VALUES 
(ST_GeomFromText('POINT(0 0)')),
(ST_GeomFromText('POINT(1 1)')),
(ST_GeomFromText('POLYGON((0 0, 4 0, 4 4, 0 4, 0 0))'));

-- 创建空间索引
CREATE INDEX spatial_data_gist_idx
  ON spatial_data
  USING GIST (geom);
```

有关 PostGIS 的更多使用方法，请参阅 [PostGIS 官方手册](https://postgis.net/documentation/manual/)。
