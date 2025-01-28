import React, {useState, useCallback, useEffect} from "react";
import { Chat, Modal, Input, Toast } from "@douyinfe/semi-ui";
import { IconSetting } from "@douyinfe/semi-icons";
import "./index.less";

const defaultMessage = [];

const roleInfo = {
  user:  {
    name: 'User',
    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
  },
  assistant: {
    name: 'Assistant',
    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
  },
  system: {
    name: 'System',
    avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
  }
};

let id = 0;
function getId() {
  return `id-${id++}`
};

const uploadProps = { action: 'https://api.semi.design/upload' };
const uploadTipProps = { content: '自定义上传按钮提示信息' };

export default function HomeView() {
  const [message, setMessage] = useState(defaultMessage);
  const [visible, setVisible] = useState(false);
  const [stopGenerate, setStopGenerate] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    window.API.getDeepseekKey()
      .then((res) => {
        if (res.status) {
          setKey(res.info);
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
          role: "assistant",
          id: data.id,
          createAt: data.created
        }
        return [...message, newMessage]
      });
    });
  }, []);

  const onMessageSend = useCallback((content, attachment) => {
    const newAssistantMessage = {
      role: "assistant",
      id: getId(),
      content: "",
      createAt: Date.now(),
      status: "loading",
    }
    setStopGenerate(true);
    setMessage((message) => ([ ...message, newAssistantMessage])); 

    window.API.sendChatMessage(content)
      .then(() => {
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
  }, []);

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
          <div>
            test
          </div>
          <div className="container-header-settings" onClick={showDialog}>
            <IconSetting size="large"/>
          </div>
        </div>
        <div className="container-body">
          <Chat 
            align="leftRight"
            mode="userBubble"
            uploadProps={uploadProps}
            className="chat-container"
            chats={message}
            roleConfig={roleInfo}
            showStopGenerate={stopGenerate}
            onChatsChange={onChatsChange}
            onMessageSend={onMessageSend}
            onMessageReset={onMessageReset}
            uploadTipProps={uploadTipProps}
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