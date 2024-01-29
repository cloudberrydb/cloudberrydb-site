// styles declare
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
  declare module "*.scss";
}

// pictures declare
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
