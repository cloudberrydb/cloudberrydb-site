---
title: Geospatial Analytics
---

# Geospatial Analytics

[PostGIS](https://postgis.net/) extends the capabilities of the PostgreSQL by adding support for storing, indexing, and querying geospatial data. Cloudberry Database supports PostGIS for geospatial analytics.

This document introduces how to compile and build PostGIS for your Cloudberry Database cluster.

You can access the Cloudberry Database PostGIS project repo at [`cloudberrydb/postgis`](https://github.com/cloudberrydb/postgis). The PostGIS code in this repo is dedicated to Cloudberry Database. The compilation and building method introduced in this document is based on the code of this repo.

## Compile PostGIS for Cloudberry Database

Before installing PostGIS for Cloudberry Database, install the required dependencies and compile several components. This process is currently supported only on CentOS, with plans to support Rocky Linux in the future.

Before you get started, ensure that the Cloudberry Database is correctly installed on your machine. If it is not installed, see the [documentation](https://cloudberrydb.org/docs/) for installation instructions.

1. Install the pre-requested dependencies.

    ```bash
    yum install -y libtool proj-devel boost-devel gmp-devel mpfr-devel pcre-devel protobuf protobuf-c protobuf-devel protobuf-c-devel && \
    yum install -y gcc make subversion gcc-c++ sqlite-devel libxml2-devel swig expat-devel libcurl-devel python36-devel json-c
    ```

2. Build the components (GDAL, CGAL, SFCGAL, and GEOS). Make sure you are building them by `root`.

    1. Build GDAL.

        [GDAL](https://gdal.org/index.html) is a translator library for raster and vector geospatial data formats. Follow the commands to install it:

        ```bash
        wget https://download.osgeo.org/gdal/2.2.1/gdal-2.2.1.tar.gz --no-check-certificate
        tar xf gdal-2.2.1.tar.gz
        cd gdal-2.2.1/
        ./configure --prefix=/usr/local/gdal-2.2.1
        make && make install
        ```

    2. Build CGAL.

        [CGAL](https://www.cgal.org/) provides easy access to efficient and reliable geometric algorithms in the form of a C++ library. Follow the commands to install it:

        ```bash
        wget https://github.com/CGAL/cgal/archive/releases/CGAL-4.13.tar.gz
        tar xf CGAL-4.13.tar.gz
        cd cgal-releases-CGAL-4.13/
        mkdir build && cd build
        cmake ..
        make && make install
        ```

    3. Build SFCGAL.

        [SFCGAL](https://github.com/Oslandia/SFCGAL) is a C++ wrapper library around CGAL to support ISO 19107:2013 and OGC Simple Features Access 1.2 for 3D operations. Follow the commands to install it:

        ```bash
        wget https://github.com/Oslandia/SFCGAL/archive/v1.3.6.tar.gz
        tar xf v1.3.6.tar.gz
        cd SFCGAL-1.3.6/
        mkdir build && cd build
        cmake -DCMAKE_INSTALL_PREFIX=/usr/local/sfcgal-1.3.6 ..
        make && make install
        ```

    4. Build GEOS.

        [GEOS](https://libgeos.org/) is a C/C++ library for computational geometry with a focus on algorithms used in geographic information systems (GIS) software. Follow the commands to install it:

        ```bash
        wget https://download.osgeo.org/geos/geos-3.7.0.tar.bz2 --no-check-certificate
        tar xf geos-3.7.0.tar.bz2
        cd geos-3.7.0/
        ./configure --prefix=/usr/local/geos-3.7.0/
        make && make install
        ```

    5. Update `/etc/ld.so.conf`.

        After installing the above components, update `/etc/ld.so.conf` to configure the dynamic loader to search for their directories:

        ```bash
        cat << EOF >> /etc/ld.so.conf
        /usr/lib/
        /usr/lib64/
        /usr/local/sfcgal-1.3.6/lib64/
        /usr/local/gdal-2.2.1/lib/
        /usr/local/geos-3.7.0/lib/
        EOF
        ```

        Then run the command `ldconfig`.

3. Build and install PostGIS.

    1. Download the `cloudberrydb/postgis` repo to your `/home/gpadmin` directory:

        ```bash
        git clone https://github.com/cloudberrydb/postgis.git /home/gpadmin/postgis
        chown -R gpadmin:gpadmin /home/gpadmin/postgis
        ```

    2. Compile PostGIS.

        Before starting the compilation process, run the following commands to make sure the environment variables are set ready:

        ```bash
        source /usr/local/cloudberrydb/greenplum_path.sh
        source /home/gpadmin/cloudberrydb/gpAux/gpdemo/gpdemo-env.sh
        scl enable devtoolset-10 bash
        source /opt/rh/devtoolset-10/enable
        ```

        Then continue:

        ```bash
        cd /home/gpadmin/postgis/postgis/build/postgis-2.5.4/
        ./autogen.sh
        ./configure --prefix="${GPHOME}" --with-pgconfig="${GPHOME}"/bin/pg_config --with-raster --without-topology --with-gdalconfig=/usr/local/gdal-2.2.1/bin/gdal-config --with-sfcgal=/usr/local/sfcgal-1.3.6/bin/sfcgal-config --with-geosconfig=/usr/local/geos-3.7.0/bin/geos-config
        make && make install
        ```

## Use PostGIS in Cloudberry Database

After you have compiled and built PostGIS and the supporting extensions successfully on your Cloudberry Database cluster and have started the demo cluster, you can run the following commands to enable PostGIS and the supporting extensions:

```sql
$ psql -p 7000 postgres

postgres=# CREATE EXTENSION postgis;     -- Enables PostGIS and raster
postgres=# CREATE EXTENSION fuzzystrmatch;     -- Required for installing Tiger Geocoder
postgres=# CREATE EXTENSION postgis_tiger_geocoder;     -- Enables Tiger Geocoder
postgres=# CREATE EXTENSION address_standardizer;     -- Enables address_standardizer
postgres=# CREATE EXTENSION address_standardizer_data_us;
```

The following example uses PostGIS to create non-OpenGIS tables in the database, and insert and query geometric objects.

```sql
-- Creates a table named geom_test.
CREATE TABLE geom_test ( gid int4, geom geometry, 
  name varchar(25) );

-- Inserts a row into the table. The gid is 1, the geometry field represents a three-dimensional polygon object (a 3D square) using WKT format, and the name is '3D Square'.
INSERT INTO geom_test ( gid, geom, name )
  VALUES ( 1, 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))', '3D Square');
  
-- Inserts the second row. The gid is 2, the geometry is a three-dimensional line string, and the name is '3D Line'.
INSERT INTO geom_test ( gid, geom, name ) 
  VALUES ( 2, 'LINESTRING(1 1 1,5 5 5,7 7 5)', '3D Line' );
  
-- Inserts the third row. The gid is 3, the geometry is a two-dimensional multi-point object, and the name is '2D Aggregate Point'.
INSERT INTO geom_test ( gid, geom, name )
  VALUES ( 3, 'MULTIPOINT(3 4,8 9)', '2D Aggregate Point' );

-- Uses ST_GeomFromEWKT to build a three-dimensional lines tring object from EWKT, then use Box3D to get the three-dimensional bounding box of that object. Use the && operator to query all rows in the geom_test table whose geom field intersects with the bounding box.
SELECT * from geom_test WHERE geom &&
  Box3D(ST_GeomFromEWKT('LINESTRING(2 2 0, 3 3 0)'));
```

The following example uses PostGIS to create a table with geo-referenced data, inserts geo-coded point data, and outputs point data in standard text format.

```sql
-- Creates a table named geotest.
CREATE TABLE geotest (id INT4, name VARCHAR(32) );

-- Adds a geometry column named geopoint to the geotest table, defined as a POINT type with 2 dimensions, and specifies its Spatial Reference System (SRID) as 4326 (representing the WGS84 geographic coordinate system).
SELECT AddGeometryColumn('geotest','geopoint', 4326,'POINT',2);

-- Inserts the first row. The id is 1, the name is 'Olympia', and geopoint is a point object build from WKT text using ST_GeometryFromText with coordinates (-122.90, 46.97) and SRID 4326.
INSERT INTO geotest (id, name, geopoint)
  VALUES (1, 'Olympia', ST_GeometryFromText('POINT(-122.90 46.97)', 4326));
  
-- Inserts the second row. The id is 2, the name is 'Renton', with point coordinates (-122.22, 47.50) and the same SRID of 4326.
INSERT INTO geotest (id, name, geopoint)
  VALUES (2, 'Renton', ST_GeometryFromText('POINT(-122.22 47.50)', 4326));

-- Selects the name and geopoint fields from the geotest table, but converts the geopoint field to standard text (WKT) format using the ST_AsText function.
SELECT name,ST_AsText(geopoint) FROM geotest;
```

The following example uses the spatial indexing feature.

```sql
-- Creates table.
CREATE TABLE spatial_data (
  id SERIAL PRIMARY KEY,
  geom geometry
);

-- Inserts data.
INSERT INTO spatial_data (geom) VALUES 
(ST_GeomFromText('POINT(0 0)')),
(ST_GeomFromText('POINT(1 1)')),
(ST_GeomFromText('POLYGON((0 0, 4 0, 4 4, 0 4, 0 0))'));

-- Creates spatial index.
CREATE INDEX spatial_data_gist_idx
  ON spatial_data
  USING GIST (geom);
```

For more usages, you can follow the [PostGIS manual](https://postgis.net/documentation/manual/).
