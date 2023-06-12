from dotenv import load_dotenv
import os
load_dotenv()
import uvicorn
from langchain.tools import Tool
from langchain.utilities import GoogleSearchAPIWrapper
from fastapi import FastAPI
from langchain.agents import Tool
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain import PromptTemplate

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_CSE_ID=os.getenv("GOOGLE_CSE_ID")
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")

app = FastAPI()

chat_history = []

@app.post("/chatbot")
def chatbot(query: str):
    global chat_history
    
    search = GoogleSearchAPIWrapper(k=10)
    tools = Tool(
    name = "Google Search",
    description="Search Google for recent results related to Python and React and provide a descriptive answer.",
    func=search.run,
    )

    # Create the OpenAI language model
    llm = ChatOpenAI(temperature=0.2, model_name="gpt-3.5-turbo")

    # Create the conversation buffer memory
    memory = ConversationBufferMemory(memory_key="chat_history")

    # chat_history = []

    # Define the chatbot prompt template
    QA_PROMPT_TMPL = '''{bot_name} is a chatbot developed by {company_name} that helps you with python and react related questions. It helps you with documentation, installation, code understanding, etc. It provides user with a clear and concise guidance related to python and react language.
    Context:
    {context_str}
    Conversation History:
    {chat_history}
    User:
    {query_str}
    Reply:'''

    prompt = PromptTemplate(
        template=QA_PROMPT_TMPL,
        input_variables=["context_str", "chat_history", "query_str"],
        partial_variables={"bot_name": "codingBOT", "company_name": "XYZ"}
    )

    # Initialize the chatbot agent
    agent_chain = initialize_agent(
        [tools],
        llm,
        agent="conversational-react-description",
        memory=memory,
        verbose=True,
        max_iterations=1,
    )

    # Generate the chatbot response
    chat_history_str = "\n".join(chat_history)
    agent_prompt = prompt.format(query_str=query, context_str="casual", chat_history=chat_history_str)
    #response = str(agent_chain.run(agent_prompt)).strip()
    try:
        response = agent_chain.run(input=agent_prompt)
    except ValueError as e:
        response = str(e)
        if not response.startswith("Could not parse LLM output: `"):
            raise e
        response = response.removeprefix("Could not parse LLM output: `").removesuffix("`")

    # Add the user's query and the chatbot's response to the chat history
    chat_history.append(f"User: {query}, Response: {response}")

    if len(chat_history_str) > 3000:
        chat_history.pop(0)

    # Return the chatbot's response
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("chatbot:app", host="0.0.0.0", port=8088, reload=True)

