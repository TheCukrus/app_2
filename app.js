import { readFileSync, writeFileSync } from "fs";
import { createServer } from "http";
import { db } from "./modules/db.js";

const index_html = readFileSync("index.html", "utf-8");
const admin_html = readFileSync("admin.html", "utf-8");

db.read_from_file();

//
//
//

const http1 = createServer(function (req, res)
{
    if (req.method === "GET")
    {
        //console.log(`get request from ${req.socket.remoteAddress}`);
        //GET routes
        //

        if (req.url === "/")
        {
            res.setHeader("Content-Type", "text/html; charset=UTF-8");
            res.write(index_html);
            res.end();
        }
        else if (req.url === "/admin")
        {
            res.setHeader("Content-Type", "text/html; charset=UTF-8");
            res.write(admin_html);
            res.end();
        }
        else if (req.url === "/api/tickets")
        {
            res.setHeader("Content-Type", "application/json; charset=UTF-8");
            res.write(db.stringify());
            res.end();
        }
        else
        {
            res.write("error");
            res.end();
        }
    }
    else if (req.method === "POST")
    {
        let data = '';

        req.on('data', function (chunk)
        {
            data += chunk;
        });

        req.on('end', function ()
        {
            //
            //POST routes
            //

            if (req.url === "/api/add_ticket")
            {
                const temp = JSON.parse(data);

                //
                //input verifcation to do
                //

                let result = "operation completed successfully";
                let prop;
                
                try
                {
                    //year
                    prop = "year";
                    if (temp.hasOwnProperty(prop) === false) throw `property [${prop}] not found`;
                    if ((/^(2)02([1-2])$/.test(temp[prop]) === false)) throw `property [${prop}] failed RegExp tests`;
                    //month
                    prop = "month";
                    if (temp.hasOwnProperty(prop) === false) throw `property [${prop}] not found`;
                    if ((/^(1)([0-2])$/.test(temp[prop]) === false) && (/^(1)([0-2])$/.test(temp.month) === false)) throw `property [${prop}] failed RegExp tests`;
                    //day
                    prop = "day";
                    if (temp.hasOwnProperty(prop) === false) throw `property [${prop}] not found`;
                    if (parseInt(temp[prop]) === NaN) throw `property [${prop}] failed to parse to Int`;
                    const max_day_in_what_month = new Date(temp.year, temp.month, 0).getDate();
                    if ((parseInt(temp.day) < 1) || (parseInt(temp.day) > max_day_in_what_month)) throw `property [${prop}] invalid day`;
                    //h

                    //min

                    //db.add
                    if (db.add(parseInt(temp.year), parseInt(temp.month), parseInt(temp.day), parseInt(temp.h), parseInt(temp.min)) === 0) throw `uid already exists`;
                }
                catch (err)
                {
                    result = `operation failed: ${err}`;
                }
                finally
                {
                    res.setHeader("Content-Type", "text/plain; charset=UTF-8");
                    res.write(`${result}`);
                    res.end();
                }

                //
                //
                //
            }

            if (req.url === "/api/remove_ticket")
            {
                //
                //input verifcation to do
                //

                const temp = JSON.parse(data);

                const result = db.remove(parseInt(temp.uid));

                res.setHeader("Content-Type", "text/plain; charset=UTF-8");
                res.write(`${result}`);
                res.end();
            }

        });
    }
});

http1.listen(process.env.PORT || 80);