import styled from "@emotion/styled";

const TableStyled = styled.div`
  overflow: scroll;

  [data-sticky-last-left-td] {
    box-shadow: 2px 0px 3px #ccc;
  }

  [data-sticky-first-right-td] {
    background: white;
    
    :first-of-type(1) {
      margin-left: 10px;
    }
  }

  .column-sticky {
    &::after {
      bottom: 0;
      content: "";
      transform: translateX(-97%);
      position: absolute;
      right: 0;
      box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
      top: 0;
      width: 100%;
    }
  }


  [data-sticky-td] {
    background: white;
    position: sticky;
  }


  table {
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }

      :hover {
        box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);
        cursor: pointer;
      }
    }

    th,
    td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow: scroll;
      thead,
      .footer {
        position: sticky;
        z-index: 1;
        width: 100%;
      }

      thead {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      td {
        border-bottom-width: 1px;
        border-bottom-style: dashed;
        border-bottom-color: #d5d5d5;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      tbody {
        position: relative;
        z-index: 0;
      }
    }
  }
`


export default TableStyled
