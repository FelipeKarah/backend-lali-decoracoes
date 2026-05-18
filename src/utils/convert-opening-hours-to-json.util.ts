interface IHours {
    start: string;
    end: string;
}

interface IOpeningHoursDTO {
    sunday: IHours[];
    monday: IHours[];
    tuesday: IHours[];
    wednesday: IHours[];
    thursday: IHours[];
    friday: IHours[];
    saturday: IHours[];
}


export const convertOpeningHoursToJsonUtil = (data: IOpeningHoursDTO) => {
    return {
        sunday: JSON.stringify(data?.sunday),
        monday: JSON.stringify(data?.monday),
        tuesday: JSON.stringify(data?.tuesday),
        wednesday: JSON.stringify(data?.wednesday),
        thursday: JSON.stringify(data?.thursday),
        friday: JSON.stringify(data?.friday),
        saturday: JSON.stringify(data?.saturday)
    }
}