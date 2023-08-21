import { AcademicSemester, Prisma } from "@prisma/client";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IAcademicSemesterFilterRequest } from "./academicSemester.interface";
import { AcademicSemesterSearchAbleFields } from "./academicSemester.contants";
import prisma from "../../../shared/prisma";




const insertIntoDB = async ( academicSemesterData: AcademicSemester): Promise<AcademicSemester> => {
    const result = await prisma.academicSemester.create({
        data: academicSemesterData
    })

    return result;
}

const getAllFromDB = async (

    filters : IAcademicSemesterFilterRequest,
    options : IPaginationOptions
):Promise<IGenericResponse<AcademicSemester[]>> => {
    const {page, limit, skip} = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData} = filters;
    console.log(filterData, filters)
    
    const andCondition = [];

    if(searchTerm){
        andCondition.push({
            OR: AcademicSemesterSearchAbleFields.map((field) => ({
                [field]:{

                }
            }))
        })
    }

    if(Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key] : {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.AcademicSemesterWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

    const result = await prisma.academicSemester.findMany({
        where: whereConditions, 
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder
        }
        : {
            createdAt: 'desc'
        }



    });

    const total = await prisma.academicSemester.count();

    return {
        meta: {
            total,
            page, limit
         },
        data: result
    }
}

const getDataById = async (id: string): Promise<AcademicSemester | null> => {
    const result = await prisma.academicSemester.findUnique({
        where: {
            id
        }
    })

    return result;
}


export const AcademicSemesterService = {
    insertIntoDB,
    getAllFromDB,
    getDataById 
} 













