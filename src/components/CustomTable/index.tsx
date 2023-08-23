import React, { useState } from "react";
import { AngleDownIcon, AngleUpIcon, MoreIcon } from "../../theme/svgs";
import { ListTableData } from "../../models/ListTableData";
import { renderValue } from "../../utils/renderUtils";

interface Props {
  tableData: ListTableData;
  isCollapsible?: boolean;
  hasActionBtn?: boolean;
  headerBtnText: string;
  onClickHeaderBtn: () => void;
}

const CustomTable: React.FC<Props> = ({ tableData, isCollapsible = false, hasActionBtn = false, headerBtnText, onClickHeaderBtn }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <div className="relative overflow-x-auto shadow-md rounded-xl my-4">
      <table className="w-full bg-white">
        <thead className="bg-MenuBarBg text-[16px] font-Pr text-white text-left">
          <tr>
            {isCollapsible ? <th scope="col" className="px-6 py-3" /> : null}
            {tableData.columnHeaders.map((mainColHead) => {
              return (
                <th scope="col" className="px-6 py-3">
                  {mainColHead.label}
                </th>
              );
            })}
            {hasActionBtn ? (
              <th scope="col" colSpan={2} className="px-6 py-3">
                <div className="flex justify-end">
                  <button onClick={onClickHeaderBtn} className="w-40 text-white font-Pr text-[14px] bg-gradientDarkBlue py-2 rounded-[6px] self-center focus:outline-none disabled:opacity-60">
                    {headerBtnText}
                  </button>
                </div>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="text-[14px] font-Pr text-SubHeading text-left">
          {tableData.rows.map((mainRow) => {
            return (
              <>
                <tr className="bg-white border-b hover:bg-gray-50 shadow-md">
                  {isCollapsible ? (
                    <td className="px-6 py-4">
                      <div className="flex items-center w-[14px] h-[14px]" onClick={() => setSelectedRow(selectedRow !== mainRow.resourceId ? mainRow.resourceId : null)}>
                        {selectedRow === mainRow.resourceId ? (
                          <img src={AngleUpIcon} alt={"angle-up-icon"} className={"w-[14px] h-[14px] cursor-pointer"} />
                        ) : (
                          <img src={AngleDownIcon} alt={"angle-down-icon"} className={"w-[14px] h-[14px] cursor-pointer"} />
                        )}
                      </div>
                    </td>
                  ) : null}
                  {mainRow.data.map((value, index) => {
                    const colHead = tableData.columnHeaders[index];
                    return <td className="px-6 py-4">{renderValue(colHead.valueFormatter(value), colHead.isImage)}</td>;
                  })}
                  {hasActionBtn ? (
                    <>
                      <td className="px-6 py-4">
                        <button className="md:w-20 md:h-8 w-20 h-8 text-HeadingColor font-Pm text-[12px] border-HeadingColor border-2 rounded-lg mx-1 hover:bg-HeadingColor hover:text-white">
                          Details
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <img src={MoreIcon} alt={"more-icon"} className={"w-5 h-5 cursor-pointer"} />
                      </td>
                    </>
                  ) : null}
                </tr>
                {isCollapsible && selectedRow === mainRow.resourceId ? (
                  <tr className="bg-white border-b shadow-md">
                    <td colSpan={12} className="px-6 py-4">
                      <table className="w-full rounded-lg overflow-hidden">
                        <thead className="bg-SubTableHead text-[13px] font-Pr text-black text-left">
                          <tr>
                            {mainRow.detailData.columnHeaders.map((subColHead) => {
                              return (
                                <th scope="col" className="px-6 py-3">
                                  {subColHead.label}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="text-[12px] font-Pr text-SubHeading text-left">
                          {mainRow.detailData.rows.map((subRow) => {
                            return (
                              <tr className="hover:bg-gray-50">
                                {subRow.data.map((value, index) => {
                                  const colHead = mainRow.detailData.columnHeaders[index];
                                  return (
                                    <th scope="col" className="px-6 py-3">
                                      {renderValue(colHead.valueFormatter(value), colHead.isImage)}
                                    </th>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ) : null}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
