import styled from "@emotion/styled";
import tw from 'twin.macro'

const PaginationStyle = styled.div`
  ${tw`grid grid-cols-2 py-5 pe-10`}

  div:nth-of-type(1) {
    ${tw`justify-self-start`}
  }

  div:nth-of-type(2) {
    ${tw`justify-self-end`}
  }
  ul {
    display: flex;
    list-style-type: none;

    .pagination-item {
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      margin: auto 4px;
      color: rgba(0, 0, 0, 0.87);a
      display: flex;
      box-sizing: border-box;
      align-items: center;
      letter-spacing: 0.01071em;
      border-radius: 16px;
      font-size: 13px;
      min-width: 32px;

      &.dots:hover {
        background-color: transparent;
        cursor: default;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        cursor: pointer;
      }

      &.selected {
        background-color: rgba(0, 0, 0, 0.08);
      }

      .arrow {
        &::before {
          position: relative;
          /* top: 3pt; Uncomment this to lower the icons as requested in comments*/
          content: '';
          /* By using an em scale, the arrows will size with the font */
          display: inline-block;
          width: 0.4em;
          height: 0.4em;
          border-right: 0.12em solid rgba(0, 0, 0, 0.87);
          border-top: 0.12em solid rgba(0, 0, 0, 0.87);
        }

        &.left {
          transform: rotate(-135deg) translate(-50%);
        }

        &.right {
          transform: rotate(45deg);
        }
      }

      &.disabled {
        pointer-events: none;

        .arrow::before {
          border-right: 0.12em solid rgba(0, 0, 0, 0.43);
          border-top: 0.12em solid rgba(0, 0, 0, 0.43);
        }

        &:hover {
          background-color: transparent;
          cursor: default;
        }
      }
    }
  }
`

export default PaginationStyle