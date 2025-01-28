import React, {useState, useCallback, useEffect} from "react";
import { Chat, Modal, Input, Toast, Select } from "@douyinfe/semi-ui";
import { IconSetting, IconRefresh } from "@douyinfe/semi-icons";
import deepseek from "../../assets/images/deepseek.png";
import user from "../../assets/images/user.png";
import "./index.less";

const roleInfo = {
  user:  {
    name: "User",
    avatar: user
  },
  system: {
    name: "Deepseek",
    avatar: deepseek
  }
};

const models = [
  "deepseek-chat",
  "deepseek-reasoner"
];

let id = 0;
function getId() {
  return `id-${id++}`
};

// const uploadProps = { action: 'https://api.semi.design/upload' };
// const uploadTipProps = { content: '自定义上传按钮提示信息' };

export default function HomeView() {
  const [message, setMessage] = useState([]);
  const [visible, setVisible] = useState(false);
  const [stopGenerate, setStopGenerate] = useState(false);
  const [model, setModel] = useState("deepseek-chat");
  const [key, setKey] = useState("");

  useEffect(() => {
    window.API.getDeepseekKey()
      .then((res) => {
        if (res.status) {
          setKey(res.info.key);
          setModel(res.info.model);
        }
      })
      .catch((e) => {
        Toast.error({
          content: "获取key失败",
          duration: 3,
          stack: true,
        });
      });

    window.API.getChatMessage((_, data) => {
      setMessage((message) => {
        const temp = message.pop();
        const newMessage = {
          content: temp.content + data.choices[0]?.delta?.content || '',
          role: "system",
          id: data.id,
          createAt: data.created
        }
        return [...message, newMessage]
      });
    });
  }, []);

  // select
  const selectModel = (value) => {
    setModel(value);
    window.API.selectModel(value);
  };  

  // chat
  const onMessageSend = useCallback((content, attachment) => {
    const newAssistantMessage = {
      role: "system",
      id: getId(),
      content: "",
      createAt: Date.now(),
      status: "loading",
    }
    setStopGenerate(true);
    setMessage((message) => ([ ...message, newAssistantMessage])); 
    window.API.sendChatMessage([...message.map(item => ({role: item.role, content: item.content})), { role: "user", content }])
      .then((res) => {
        if (!res.status) {
          Toast.error({
            content: res.message,
            duration: 3,
            stack: true,
          });
        }
        setStopGenerate(false);
      })
      .catch(() => {
        setStopGenerate(false);
        Toast.error({
          content: "发送失败",
          duration: 3,
          stack: true,
        });
      });
  }, [message]);

  const onChatsChange = useCallback((chats) => {
      setMessage(chats);
  }, []);

  const onMessageReset = useCallback((e) => {
    setTimeout(() => {
        setMessage((message) => {
            const lastMessage = message[message.length - 1];
            const newLastMessage = {
                ...lastMessage,
                status: 'complete',
                content: 'This is a mock reset message.',
            }
            return [...message.slice(0, -1), newLastMessage]
        })
    }, 200);
  });

  const onStopGenerator = () => {
    setMessage((message) => {
      return [...message.slice(0, -1)]
  })
  };

  // dialoag
  const showDialog = () => {
    setVisible(true);
  };

  const handleOk = () => {
    window.API.setDeepseekKey(key)
      .then((res) => {
        if (res.status) {
          Toast.success({
            content: res.message,
            duration: 3,
            stack: true,
          });
        } else {
          Toast.error({
            content: "请输入正确的key",
            duration: 3,
            stack: true,
          });
        }
      })
      .catch((err) => {
        Toast.error({
          content: "请输入正确的key",
          duration: 3,
          stack: true,
        });
      });
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
      <div className="container">
        <div className="container-header">
          <div style={{color: "#fff", fontSize: "16px", fontWeight: 600}}>
            <span>Deepseek</span>
          </div>
          <div className="container-header-model">
            <span>模型: </span>
            <Select defaultValue={"deepseek-chat"} size="small" onSelect={selectModel} style={{width: "180px"}} value={model}>
              {models.map((item)=> <Select.Option value={item}>{item}</Select.Option>)}
            </Select>
            <IconRefresh onClick={() => {setMessage([])}} className="icon"/>
          </div>
          <div className="container-header-settings" onClick={showDialog}>
            <IconSetting size="large" />
          </div>
        </div>
        <div className="container-body">
          <Chat 
            align="leftRight"
            mode="userBubble"
            // uploadProps={uploadProps}
            className="chat-container"
            chats={message}
            roleConfig={roleInfo}
            showStopGenerate={stopGenerate}
            showClearContext={true}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            onMessageReset={onMessageReset}
            onStopGenerator={onStopGenerator}
          />
        </div>
        <Modal
          title="deepseek key"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          closeOnEsc={true}
        >
          <Input onChange={(value) => setKey(value)} value={key} placeholder={"请输入key"}></Input>
        </Modal>
      </div>
  )
}