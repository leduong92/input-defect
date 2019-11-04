using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using VNNSIS.Data;

namespace VNNSIS.Helpers {
    public static class Helpers
    {
        //private static SqlDbContext _sqlDbContext;
        // public static List<T> RawSqlQuery<T>(string query, Func<DbDataReader, T> map)
        // {
        //     using (var context = new DbContext())
        //     {
        //         using (var command = context.Database.GetDbConnection().CreateCommand())
        //         {
        //             command.CommandText = query;
        //             command.CommandType = CommandType.Text;

        //             context.Database.OpenConnection();

        //             using (var result = command.ExecuteReader())
        //             {
        //                 var entities = new List<T>();

        //                 while (result.Read())
        //                 {
        //                     entities.Add(map(result));
        //                 }

        //                 return entities;
        //             }
        //         }
        //     }
        // }
        // using (var command = this._sqlDbContext.Database.GetDbConnection().CreateCommand())
        // {
        //     command.CommandText = "select top 1 operationnumber from sis_pro_error_record  " +
        //                                 " where joborderno = @p1 and progressoperationcode = @p2 group by JobOrderNo, OperationNumber order by operationnumber desc";
        //     command.CommandType = CommandType.Text;
        //     var parameter = new SqlParameter("@p1", jobOrderNo);
        //     var parameter2 = new SqlParameter("@p2", operationCode);
        //     command.Parameters.Add(parameter);
        //     command.Parameters.Add(parameter2);
        //     this._sqlDbContext.Database.OpenConnection();

        //     using (var result = command.ExecuteReader())
        //     {
        //         while (result.Read())
        //         {
                    
        //         }
        //     }
        // }
    }
}
