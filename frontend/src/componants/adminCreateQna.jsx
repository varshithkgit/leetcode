import { useForm , useFieldArray} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

const prblmSchem=z.object({
  title:z.string().min(1,'Title is required'),
  description:z.string().min(1,'Description is required'),
  difficulty:z.enum(["easy","medium","hard"]),
  tags:z.enum(["Array","Linkedlist","DP","Graph"]),
  visibleTestCases:z.array(
    z.object({
    input:z.string().min(1,'Input is required'),
    output:z.string().min(1,'Output is required'),
    explanation:z.string().min(1,'Explanation is required')
    })
).min(1, 'At least one visible test case required'),
  hiddenTestCases:z.array(
    z.object({
    input:z.string().min(1,'Input is required'),
    output:z.string().min(1,'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode:z.array(
    z.object({
    language:z.enum(["c++","java","javascript"]),
    initialCode:z.string().min(1,'Initial code is required')
    })
  ).length(3,"All 3 language required"),
  referenceSolution:z.array(
    z.object({
    language:z.enum(["c++","java","javascript"]),
    completeCode:z.string().min(1,'Complete code is required')
    })
  ).length(3,"All 3 language required"),
  Aprouch:z.array(
    z.object({
      concept:z.string().min(1,'Concept is required'),
      steps:z.string().min(1,'Steps is required'),
      complexities:z.string().min(1,'Complexity is required'),
      name:z.enum(["Brute Force","Better Aprouch","Optimized Aprouch"])
    })
  ).length(3,"All 3 language required")
});

function CreateQna(){
      const {register
      ,handleSubmit
      ,formState:{errors}
      ,control
    }=useForm({
               resolver:zodResolver(prblmSchem),                               
              defaultValues:{
                startCode:[
                {language:"c++",initialCode:''},
                {language:"java",initialCode:''},
                {language:"javascript",initialCode:''}
                  ],
                referenceSolution:[
                {language:"c++",completeCode:''},
                {language:"java",completeCode:''},
                {language:"javascript",completeCode:''}                  
                ],
                visibleTestCases:[{input:'',output:'',explanation:''}],
                hiddenTestCases:[{input:'',output:''}],
                Aprouch:[
                  {concept:"",steps:"",complexities:"",name:"Brute Force"},
                  {concept:"",steps:"",complexities:"",name:"Better Aprouch"},
                  {concept:"",steps:"",complexities:"",name:"Optimized Aprouch"}
                ]
               }
            });
                                               
  const {fields:visible,append:appendVisible,remove:removeVisible}=useFieldArray({
    control,
    name:"visibleTestCases"
  });

  const {fields:hidden,append:appendHidden,remove:removeHidden}=useFieldArray({
    control,
    name:"hiddenTestCases"
  });


  const navigate=useNavigate();
  
  const submitHandler =  async (prblmData)=>{
       
       try{
          let prblmArray=prblmData?.Aprouch?.map(obj=> ({concept:obj?.concept?.split(","),steps:obj?.steps?.split(","),complexities:obj?.complexities?.split(","),name:obj?.name}));
          await axiosClient.post("/prblm/create",{...prblmData,Aprouch:prblmArray});
          alert("Problem created successfully.");
          navigate('/',{replace:true});
       }
       catch(error)
       {
          alert(`Error: ${error.response?.data?.message || error.message}`);
       }
  }

  return (
<div className="min-h-screen bg-[#121212] text-[#f5f5f5] py-10 px-4">
  <form
    className="max-w-5xl mx-auto space-y-10"
    onSubmit={handleSubmit(submitHandler)}
  >
    <h1 className="text-4xl font-bold text-center">Create New Problem</h1>

    <section className="bg-[#1e1e2f] p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold">📝 Basic Information</h2>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-[#ccc]">Title</span>
        </label>
        <input
          {...register("title")}
          placeholder="Enter title"
          className={`input input-bordered bg-[#2a2a40] text-white border-[#444] ${
            errors.title ? "border-red-500" : ""
          }`}
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-[#ccc]">Description</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="Enter description"
          className={`textarea textarea-bordered bg-[#2a2a40] text-white border-[#444] h-32 ${
            errors.description ? "border-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text text-[#ccc]">Difficulty</span>
          </label>
          <select
            {...register("difficulty")}
            className="select select-bordered bg-[#2a2a40] text-white border-[#444]"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text text-[#ccc]">Tag</span>
          </label>
          <select
            {...register("tags")}
            className="select select-bordered bg-[#2a2a40] text-white border-[#444]"
          >
            <option value="Array">Array</option>
            <option value="Linkedlist">Linked List</option>
            <option value="Graph">Graph</option>
            <option value="DP">DP</option>
          </select>
        </div>
      </div>
    </section>

        {/* Test Cases */}
        <div className="bg-[#1e1e2f] p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🧪 Test Cases</h2>

          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => appendVisible({ input: '', output: '', explanation: '' })}>
                Add Visible Case
              </button>
            </div>

            {visible.map((field, index) => (
              <div className="bg-[#2a2a40] p-4 rounded-lg space-y-2 border border-[#444]" key={field.id}>
                <div className="flex justify-end">
                  <button type="button" className="btn btn-xs btn-error" onClick={() => removeVisible(index)}>
                    Remove
                  </button>
                </div>
                <textarea placeholder="Input" className="textarea textarea-bordered bg-[#1f1f30] text-white w-full h-[100px]" {...register(`visibleTestCases.${index}.input`)} />
                <textarea placeholder="Output" className="textarea textarea-bordered bg-[#1f1f30] text-white w-full h-[100px]" {...register(`visibleTestCases.${index}.output`)} />
                <textarea placeholder="Explanation" className="textarea textarea-bordered bg-[#1f1f30] text-white w-full" {...register(`visibleTestCases.${index}.explanation`)} />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => appendHidden({ input: '', output: '' })}>
                Add Hidden Case
              </button>
            </div>

            {hidden.map((field, index) => (
              <div className="bg-[#2a2a40] p-4 rounded-lg space-y-2 border border-[#444]" key={field.id}>
                <div className="flex justify-end">
                  <button type="button" className="btn btn-xs btn-error" onClick={() => removeHidden(index)}>
                    Remove
                  </button>
                </div>
                <textarea placeholder="Input" className="textarea textarea-bordered bg-[#1f1f30] text-white w-full" {...register(`hiddenTestCases.${index}.input`)} />
                <textarea placeholder="Output" className="textarea textarea-bordered bg-[#1f1f30] text-white w-full" {...register(`hiddenTestCases.${index}.output`)} />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="bg-[#1e1e2f] p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">💻 Code Templates</h2>

          <div className="space-y-6">
            {["c++", "java", "javascript"].map((lang,index) => (
              <div key={lang} className="space-y-2">
                <h3 className="font-medium capitalize">{lang}</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#ccc]">Initial Code</span>
                  </label>
                  <pre className="bg-[#2a2a40] p-4 rounded-lg">
                    <textarea className="w-full bg-transparent text-white font-mono resize-none" rows={6} {...register(`startCode.${index}.initialCode`)}/>
                  </pre>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#ccc]">Reference Solution</span>
                  </label>
                  <pre className="bg-[#2a2a40] p-4 rounded-lg">
                    <textarea className="w-full bg-transparent text-white font-mono resize-none" rows={6} {...register(`referenceSolution.${index}.completeCode`)}/>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

         {/* Aprouch Section */}
    <div className="bg-[#1e1e2f] p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">📚 Approaches</h2>

      {["Brute Force","Better Aprouch","Optimized Aprouch"].map((name, i) => (
        <div key={name} className="bg-[#2a2a40] p-4 rounded-lg mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{name}</h3>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#ccc] ml-2">Concept</span>
            </label>
            <textarea placeholder="Concepts (comma-separated)" className="textarea textarea-bordered bg-[#1f1f30] my-3 text-white w-full" {...register(`Aprouch.${i}.concept`)}></textarea>            
          </div> 

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#ccc] ml-2">Steps</span>
            </label>
            <textarea placeholder="Steps (comma-separated)" className="textarea textarea-bordered bg-[#1f1f30] my-3 text-white w-full" {...register(`Aprouch.${i}.steps`)} />   
          </div> 

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#ccc] ml-2">Complexity : -</span>
            </label>
            <br></br>
            <input placeholder="Complexities (comma-separated)" className="p-3 rounded-xl bg-[#1f1f30] my-3 text-white w-[100%] h-[10%]" {...register(`Aprouch.${i}.complexities`)} /> 
          </div> 

        </div>
      ))}

    </div>
     <button type="submit" className="btn btn-primary w-full">
      Create Problem
    </button>
  </form>
</div>
  );
}

export default CreateQna;