const fs = require('fs')
const path = require('path')
const { Document, 
        Packer, 
        Paragraph, 
        TextRun, 
        HeadingLevel, 
        LevelFormat, 
        AlignmentType, 
        Table, 
        TableRow, 
        TableCell,
        TableBorders,
        convertInchesToTwip,
        BorderStyle,
        WidthType } = require('docx')

function generateResume() {

    const resumeFilePath = path.resolve(__dirname, '../src/_data/resume.json')
    const resumeData = JSON.parse(fs.readFileSync(resumeFilePath, 'utf-8')).contents

    const renderIntro = () => {

        const childrenArray = []

        const nameRole = new Paragraph({
            heading: HeadingLevel.HEADING_1,  
            children: [
                new TextRun({
                    text: resumeData.name,
                    font: "Arial",
                    size: 34,   
                    color: "000000",
                    bold: true,        
                }),
               
            ],
            spacing: { line: 276, before: 50, after: 50 },                
        })

        const contacts = new Paragraph({
            children: [
                new TextRun({
                    text: resumeData.role,
                    font: "Arial",
                    size: 22,                    
                    color: "444444", 
                    bold: true
                }),
                new TextRun({
                    children: [
                        new TextRun({
                            text: "    |    ",
                            font: "Arial",
                            size: 20,   
                            color: "D4D4D4" 
                        }),
                        new TextRun({
                            text: resumeData.phone,
                            font: "Arial",
                            size: 22,         
                            italics: true  
                        }),
                        new TextRun({
                            text: " \u2022 ",
                            font: "Arial",
                            size: 22,    
                        }),
                        new TextRun({
                            text: resumeData.email,
                            font: "Arial",
                            size: 22,         
                            italics: true  
                        }),
                    ],
                    font: "Arial",
                    size: 22,
                }),             
            ],                       
        })       

        const line = new Paragraph({          
            text: "",
            size: 10,
            border: {
                bottom: {
                    color: "000000",
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 1,
                },
            },
            spacing: { line: 100, before: 30, after: 30 },                
        })

        childrenArray.push(nameRole)        
        childrenArray.push(contacts)
        childrenArray.push(line)

        return childrenArray
    }

    const renderSectonTitle = (titleText) => {

        const title = new Paragraph({
            heading: HeadingLevel.HEADING_1,        
            children: [
                new TextRun({
                    text: titleText,
                    font: "Arial",
                    size: 26,
                    bold: true,
                    color: "000000", 
                }),                
            ],
            spacing: { line: 276, before: 200, after: 200 },           
        })

        return title
    }

    const renderExpSectonTitle = (titleText) => {

        const title = new Paragraph({
            heading: HeadingLevel.HEADING_3,  
            children: [
                new TextRun({
                    text: titleText,
                    font: "Arial",
                    size: 18,
                    bold: true,
                    color: "444444",
                }),           
            ],
            spacing: { line: 275, before: 150, after: 100 }, 
        })

        return title
    }

    const renderSkillsAndExperience = () => {

        const childrenArray = []       

        const partSize = Math.ceil(resumeData.skills.length / 3)

        const skillsCol1 = resumeData.skills.slice(0, partSize)
        const skillsCol2 = resumeData.skills.slice(partSize, 2 * partSize)
        const skillsCol3 = resumeData.skills.slice(2 * partSize)
        
        const skillsTable = new Table({
            borders: TableBorders.NONE,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: skillsCol1.map((skill, index) => { 
                                return renderExpBullet(`${skill.name} - ${skill.years} years`, "bullet-points")                      
                            }),
                            width: {
                                size: 33,
                                type: WidthType.PERCENTAGE,
                            },                        
                        }),
                        new TableCell({
                            children: skillsCol2.map((skill, index) => { 
                                return renderExpBullet(`${skill.name} - ${skill.years} years`, "bullet-points")                      
                            }),
                            width: {
                                size: 33,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                        new TableCell({
                            children: skillsCol3.map((skill, index) => { 
                                return renderExpBullet(`${skill.name} - ${skill.years} years`, "bullet-points")                      
                            }),
                            width: {
                                size: 33,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ],
                }),
            ]
        })       

        childrenArray.push(renderSectonTitle("Key skills and years of experience"))
        childrenArray.push(skillsTable)

        return childrenArray
    }

    const renderEmploymentHistory = () => {

        let childrenArray = []

        childrenArray.push(renderSectonTitle("Employment history"))

        resumeData.workExperience.forEach((element, index) => {     
            
            const line = new Paragraph({          
                text: "",
                border: {
                    bottom: {
                        style: BorderStyle.SINGLE,
                        size: 3,
                        color: "7C7C7C",
                    },
                },
                spacing: { line: 160, before: 20, after: 20 },                
            })

            const expParagraphTitle = new Paragraph({   
                heading: HeadingLevel.HEADING_2,
                children: [
                    new TextRun({
                        text: `${formatMonthYear(element.duration.startDate)} - ${formatMonthYear(element.duration.endDate)}`,
                        bold: true,
                        font: "Arial",
                        size: 14,
                        color: "000000"
                    }),
                    new TextRun({
                        text: element.role,
                        bold: true,
                        font: "Arial",
                        size: 22,
                        italics: true,
                        break: 1,
                        color: "000000"
                    }),
                    new TextRun({
                        text: " at ",                            
                        font: "Arial",
                        size: 16,
                        color: "000000"
                    }),
                    new TextRun({
                        text: element.companyName,
                        bold: true,
                        font: "Arial",
                        size: 22,
                        italics: true,
                        color: "000000"
                    }),
                    new TextRun({
                        text: ` - ${element.location.city}, ${element.location.country}`,
                        bold: true,
                        font: "Arial",
                        size: 18,
                        italics: true,
                        color: "000000"
                    }),
                ],
                spacing: { line: 276, before: 150, after: 100 }, 
            })                 
                        
            childrenArray.push(expParagraphTitle)
            childrenArray.push(renderExpSectonTitle("Responsibilities"))

            element.responsibilities.forEach( element => {
                childrenArray.push(renderExpBullet(element, "bullet-points-indent"))
            })
            
            if(element.highlights.length > 0){

                childrenArray.push(renderExpSectonTitle("Highlights"))
                
                element.highlights.forEach( element => {
                    childrenArray.push(renderExpBullet(element, "bullet-points-indent"))
                })
            }
            
            childrenArray.push(renderExpSectonTitle("Technologies"))

            childrenArray.push(
                new Paragraph({  
                    children: [
                        new TextRun({
                            text: commaToBulletSeparated(element.technologies),
                            font: "Arial",
                            size: 20,  
                            italics: true
                        }),
                    ],  
                })
            )

            if(index + 1 < resumeData.workExperience.length) {
                childrenArray.push(line)
            }
            
        })

        return childrenArray
    }
    

    const renderExpBullet = (text, style, isBold = false) =>{   

        const bullet = new Paragraph({
            children: [
                new TextRun({
                    text: text,
                    font: "Arial",
                    size: 20,
                    bold: isBold
                })
            ],
            numbering: {
                reference: style,
                level: 0,
            },
        })

        return bullet
    }

    const commaToBulletSeparated = (text) => {

        const bulletSeparated = text.replaceAll(",","  • ")
    
        return bulletSeparated
    }

    const formatMonthYear = (partialDate) => { 

        let formattedDate

        if(partialDate === ""){

            formattedDate = "Current"

        }else{

            var [year, month] = partialDate.split('-')

            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ]
    
            const date = new Date(year, parseInt(month) - 1)
            formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
        }

        return formattedDate
    }

    const doc = new Document({
        creator: resumeData.name,            
        title: `${resumeData.name} | ${resumeData.role}`,

        numbering: {
            config: [
                {
                    reference: "bullet-points",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: "\u2022",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.2), hanging: convertInchesToTwip(0.18) },
                                },
                            },
                        },
                    ],
                },
                {
                    reference: "bullet-points-indent",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: "\u2022",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.4), hanging: convertInchesToTwip(0.18) },
                                },
                            },
                        },
                    ],
                },
            ],
        },         
        sections: [            
        {
            properties: {
                page: {
                    margin: {
                        top: 700,
                        right: 700,
                        bottom: 700,
                        left: 700,
                    },
                },
            },

            children: [
                ...renderIntro(),                    
                ...renderSkillsAndExperience(),
                ...renderEmploymentHistory()
            ] 
        },                
        ],
    })

    Packer.toBuffer(doc).then((buffer) => {
        const fileName = `oleg_rybin_front_end_dev_resume.docx`
        const modulePath = path.resolve(__dirname, '../src/assets/docs')
        

        if (!fs.existsSync(modulePath)) {
            fs.mkdirSync(modulePath, { recursive: true })
        }

        fs.writeFileSync(path.resolve(modulePath, fileName), buffer)
    })
}

module.exports = generateResume