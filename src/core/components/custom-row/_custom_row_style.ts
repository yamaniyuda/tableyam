import { css } from "@emotion/react";
import styled from "@emotion/styled";

const customColumnStyle = props =>
  css`
    width: ${props.width}
  `

const CustomColumnStyle = styled.div`
  ${customColumnStyle}
`

export default CustomColumnStyle