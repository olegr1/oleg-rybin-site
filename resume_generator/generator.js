const fs = require('fs');
const path = require('path');
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
        WidthType } = require('docx');

function generateResume() {

    const resumeFilePath = path.resolve(__dirname, '../src/_data/resume.json');
    const resumeData = JSON.parse(fs.readFileSync(resumeFilePath, 'utf-8')).contents;

    const renderIntro = () => {

        const childrenArray = [];

        const nameRole = new Paragraph({
            heading: HeadingLevel.HEADING_1,  
            children: [
                new TextRun({
                    text: resumeData.name,
                    font: "Arial",
                    size: 30,           
                }),
                new TextRun({
                    text: resumeData.role,
                    font: "Arial",
                    size: 24,                        
                    break: 1,
                }),
            ]                
        })

        const contacts = new Paragraph({
            children: [
                new TextRun({
                    text: resumeData.phone,
                    font: "Arial",
                    size: 20,           
                }),
                new TextRun({
                    text: " \u2022 ",
                    font: "Arial",
                    size: 20,    
                }),
                new TextRun({
                    text: resumeData.email,
                    font: "Arial",
                    size: 20,    
                }),
            ]                
        })        

        childrenArray.push(nameRole);        
        childrenArray.push(contacts);
        
        resumeData.intro.forEach(element => {            
            const introParagraph = new Paragraph({  
                children: [
                    new TextRun({
                        text: element,
                        font: "Arial",
                        size: 20,                        
                        break: 1,
                    }),
                ]       
            })

            childrenArray.push(introParagraph);
        });
        
        return childrenArray;
    }

    const renderSectonTitle = (titleText) => {

        const title = new Paragraph({
            heading: HeadingLevel.HEADING_1,        
            text: titleText
        })

        return title;
    }

    const renderExpSectonTitle = (titleText) => {

        const title = new Paragraph({
            heading: HeadingLevel.HEADING_3,        
            text: titleText
        })

        return title;
    }

    const renderSkillsAndExperience = () => {

        const childrenArray = []       
        
        const skillsTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: resumeData.skills.map((skill, index) => { 

                                if(index < resumeData.skills.length / 2){
                                    return renderExpBullet(`${skill.name} - ${skill.years} years`)
                                }                                
                            }),
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE,
                            }                           
                        }),
                        new TableCell({
                            children: resumeData.skills.map((skill, index) => { 
                                
                                if(index >= resumeData.skills.length / 2){
                                    return renderExpBullet(`${skill.name} - ${skill.years} years`) 
                                }                                
                            }),
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE,
                            }  
                        }),
                    ],
                }),
            ]
        })       

        childrenArray.push(renderSectonTitle("Key skills and years of experience"))
        childrenArray.push(skillsTable)

        return childrenArray;
    }

    const renderEmploymentHistory = () => {

        let childrenArray = [];

        resumeData.workExperience.forEach(element => {       

            const expParagraphTitle = new Paragraph({   
                heading: HeadingLevel.HEADING_2,
                children: [
                    new TextRun({
                        text: `${formatMonthYear(element.duration.startDate)} - ${formatMonthYear(element.duration.endDate)}`,
                        bold: true,
                        font: "Arial",
                        size: 10,
                    }),
                    new TextRun({
                        text: element.role,
                        bold: true,
                        font: "Arial",
                        size: 20,
                        italics: true,
                        break: 1,
                    }),
                    new TextRun({
                        text: " at ",                            
                        font: "Arial",
                        size: 10,
                    }),
                    new TextRun({
                        text: element.companyName,
                        bold: true,
                        font: "Arial",
                        size: 20,
                        italics: true
                    }),
                    new TextRun({
                        text: ` - ${element.location.city}, ${element.location.country}`,
                        bold: true,
                        font: "Arial",
                        size: 16,
                        italics: true
                    }),
                ]
            })      
            
            childrenArray.push(renderSectonTitle("Employment history"))

            childrenArray.push(expParagraphTitle);

            childrenArray.push(renderExpSectonTitle("Responsibilities"))

            element.responsibilities.forEach( element => {
                childrenArray.push(renderExpBullet(element));
            })

            childrenArray.push(renderExpSectonTitle("Highlights"))

            element.highlights.forEach( element => {
                childrenArray.push(renderExpBullet(element));
            })

            childrenArray.push(renderExpSectonTitle("Technologies"))

            childrenArray.push(
                new Paragraph({  
                    children: [
                        new TextRun({
                            text: element.technologies,
                            font: "Arial",
                            size: 20,                        
                            break: 1,
                        }),
                    ]       
                })
            );

        });        

        return childrenArray;
    }
    

    const renderExpBullet = (text) =>{   

        const bullet = new Paragraph({
            //text: text,
            children: [
                new TextRun({
                    text: text,
                    font: "Arial",
                    size: 18,
                })
            ],
            numbering: {
                reference: "my-bullet-points",
                level: 0,
            }
        });

        return bullet;
    }

    const formatMonthYear = (partialDate) => { 

        var [year, month] = partialDate.split('-');

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const date = new Date(year, parseInt(month) - 1);
        const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

        return formattedDate;
    };

    const doc = new Document({
        creator: resumeData.name,            
        title: `${resumeData.name} | ${resumeData.role}`,

        numbering: {
            config: [
                {
                    reference: "my-bullet-points",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: "\u2022",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: 1 },
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
    });

    Packer.toBuffer(doc).then((buffer) => {
        const fileName = `oleg_rybin_front_end_dev_resume.docx`;
        const modulePath = path.resolve(__dirname, '../src/assets/docs');
        

        if (!fs.existsSync(modulePath)) {
            fs.mkdirSync(modulePath, { recursive: true });
        }

        fs.writeFileSync(path.resolve(modulePath, fileName), buffer);
    });
}

module.exports = generateResume;