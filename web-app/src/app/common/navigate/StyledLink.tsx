import React from "react";
import { Link, LinkProps } from "react-router-dom";

type IStyledLinkProps = LinkProps & {
  onBeforeNavigate?: () => void;
};

const StyledLink = React.forwardRef<HTMLAnchorElement, IStyledLinkProps>(
  (props, ref) => {
    const { onBeforeNavigate, ...rest } = props;
    const handleClick = (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      onBeforeNavigate && onBeforeNavigate();
      props.onClick && props.onClick(event);
    };
    return (
      <Link
        ref={ref}
        {...rest}
        onClick={handleClick}
        style={{
            color: "unset",
            textDecoration: "none",
            ...props.style,
        }}
      />
    );
  }
);

export default StyledLink;
