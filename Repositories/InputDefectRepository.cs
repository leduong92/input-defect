
using System.Collections.Generic;
using System.Linq;
using VNNSIS.Data;
using VNNSIS.Models;
using VNNSIS.Interface;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VNNSIS.ViewModels;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Data.SqlClient;
using System.Data;
using System.Data.Common;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace VNNSIS.Repositories
{
    public class InputDefectRepository :  IInputDefectRepository 
    {
        private readonly SqlDbContext _sqlDbContext;
        private readonly PostgreDbContext _postGreDbContext;
        public InputDefectRepository(SqlDbContext sqlDbContext, PostgreDbContext postGreDbContext) 
        {
            _sqlDbContext = sqlDbContext;
            _postGreDbContext = postGreDbContext;
        }
        public async Task<IEnumerable<OperationNumberViewModel>> GetOperationNumber(string jobOrderNo, string operationCode)
        {
            var result =  await _sqlDbContext.OperationNumberViewModels.FromSql($"select top 1 operationnumber from sis_pro_error_record  " +
                                        " where joborderno = {0} and progressoperationcode = {1} group by JobOrderNo, OperationNumber order by operationnumber desc", jobOrderNo, operationCode).ToListAsync();
            return result;
        }
        public async Task<TrCurJobNbcs> FindJob(string jobOrderNo)
        {
            return await _postGreDbContext.tr_cur_job_nbcs.FindAsync(jobOrderNo);
        }
        public async Task<IEnumerable<InformationDataViewModel>> GetDataByJobNo(string jobOrderNo)
        {
            var result = await _postGreDbContext.InformationDataViewModels.FromSql($"select a.job_order_no, a.order_type lot_no, a.finished_goods_code, b.operation_code, b.operation_name " +
                                                                            " , b.operation_sequence, a.line_no||'/'||a.press_no as line_no, a.material_mark1, a.rotation, a.curing_qty, a.cavity_qty,  a.curing_date::text, '' as order_date   " +
                                                                            "  from tr_cur_job_nbcs a inner join td_cur_progress_master b on a.finished_goods_code = b.finished_goods_code " +
                                                                            " where a.job_order_no = {0} order by b.operation_sequence", jobOrderNo).ToListAsync();
            return result;
        }
        public async Task<IEnumerable<ErrorListViewModel>> GetDataByOperationCode(string jobOrderNo, string operationCode)
        {
            var result = await _postGreDbContext.errorListViewModels.FromSql($"select a.*, b.error_id, b.department, b.area, b.program_id,c.error_name,c.error_name_jp,c.error_name_en,d.start_date, d.end_date, d.machine_no " +
                                                                            " from td_cur_progress a left join si_pro_error_detail b on a.operation_sequence = b.progress_operation_seq " +
                                                                            " left join si_pro_error_master c on b.error_id = c.error_id  " +
                                                                            " left join td_cur_progress_check d on a.operation_code = d.operation_code  " +
                                                                            " where d.job_order_no = {0} and a.operation_code = {1} and b.location = 'OS1' and b.department = '60' and program_id = 'ID' order by b.error_id", jobOrderNo, operationCode).ToListAsync();
            return result;
        }
        public int SaveAsync(string values)
        {
            var commandText = string.Format("INSERT INTO sis_pro_error_record(JobOrderNo, OperationNumber, FinishedGoodsCode, LotNo, CavityQty, [LineNo], RubberName, PlanCycle, PlanQty, UnitCost, UnitPrice, JobStartDate, JobEndDate, OperationStartDate, OperationEndDate, MachineNo, OkQty, ProgressOperationCode, ProgressOperationSeq, ProgressOperationName, ErrorID, ErrorName, ErrorNameJP, ErrorQty, Notes, EntryDate, EntryTime, EntryUser, UpdateDate, UpdateTime, UpdateUser, [Status], ErrorNameEn, CuringDate, Department, Area, ProgramID) VALUES {0}", values);
            var result =  _sqlDbContext.Database.ExecuteSqlCommand(commandText);
            return result;
        }

    }
}