import { readFileSync, writeFileSync } from "fs";

export const db = {

    arr: [],

    find: function (uid)
    {
        for (let i = 0; i < this.arr.length; i += 1)
        {
            if (this.arr[i].uid === uid)
            {
                return 1;
            }
        }
        return 0;
    },

    add: function (year, month, day, h, min)
    {
        const temp = {};

        temp.year = year;
        temp.month = month;
        temp.day = day;
        temp.h = h;
        temp.min = min;

        temp.uid = new Date(year, month, day, h, min).getTime();

        //

        if (this.find(temp.uid))
        {
            //masyve arr jau yra objektas su tokiu uid

            return 0;
        }

        //

        this.arr.push(temp);

        this.write_to_file();

        return 1;
    },

    remove: function (uid)
    {
        for (let i = 0; i < this.arr.length; i += 1)
        {
            if (this.arr[i].uid === uid)
            {
                this.arr.splice(i, 1);
                return 1;
            }
        }

        return 0;
    },

    stringify: function ()
    {
        try
        {
            const temp = JSON.stringify(this.arr);
            return temp;
        }
        catch (err)
        {
            console.log(`db.stringify() ->${err}`);
            return "";
        }
    },

    write_to_file: function ()
    {
        try
        {
            writeFileSync("db.txt", this.stringify(), { encoding: "utf8", flag: "w", mode: 0o666 });
            return 1;
        }
        catch (err)
        {
            console.log(`db.write_to_file() ->${err}`);
            return `${err}`;
        }
    },

    read_from_file: function ()
    {
        try
        {
            const db = readFileSync("db.txt", "utf-8");
            this.arr = JSON.parse(db);

            return 1;
        }
        catch (err)
        {
            console.log(`db.read_from_file() ->${err}`);
            return `${err}`;
        }
    },
}