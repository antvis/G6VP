import React, { useEffect, useRef } from "react";
import { Button, Card, Tag, Divider, Spin } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useImmer } from "use-immer";
import { IVersionObj } from "./type";
import "./index.less";

export interface IVersionListProps {
  versionInfo: IVersionObj[];
}

const { Meta } = Card;

interface IState {
  isShowMore: boolean;
  isLoading: boolean;
  url: string;
}

const VersionList: React.FC<IVersionListProps> = (props) => {
  const { versionInfo } = props;
  const [state, updateState] = useImmer<IState>({
    isShowMore: false,
    isLoading: false,
    url: "",
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showMore = (url: string) => {
    updateState((draft) => {
      draft.isShowMore = true;
      draft.isLoading = true;
      draft.url = url;
    });
  };

  const showVersionList = () => {
    updateState((draft) => {
      draft.isShowMore = false;
      draft.url = "";
    });
  };

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        updateState((draft) => {
          draft.isLoading = false;
        });
      };
    }
  }, [state.isShowMore]);

  if (state.isShowMore) {
    return (
      <div className="detail-container">
        <header className="header">
          <h2>详细信息</h2>
          <Button
            icon={<RightOutlined />}
            type="text"
            onClick={showVersionList}
          ></Button>
        </header>
        <Divider />
        <Spin
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateX(-50%)",
            left: "50%",
            zIndex: 0,
            display: state.isLoading ? "block" : "none",        
          }}
        ></Spin>
        <iframe
          width="100%"
          height="100%"
          src={`${state.url}?view=doc_embed&from=asite`}
          style={{
            border: "none",
            background: "rgba(255, 255, 255, 0)",
            position: "absolute",
            zIndex: 1,
          }}
          ref={iframeRef}
        ></iframe>
      </div>
    );
  }

  return (
    <div>
      {versionInfo.map((item, index) => {
        const { version, type, content, image, url } = item;
        const contentList = content.split("\n");

        return (
          <div key={version} className="version-container">
            {type === "feature" ? (
              <Card
                hoverable
                cover={<img alt="example" src={image} />}
                onClick={() => showMore(url)}
              >
                <div style={{ position: "relative" }}>
                  <Meta title={version} description={content}></Meta>
                  {index === 0 && (
                    <Tag
                      color="red"
                      style={{ position: "absolute", right: "0px", top: "2px" }}
                    >
                      new
                    </Tag>
                  )}
                </div>
              </Card>
            ) : (
              <Card title={version}>
                {contentList.map((text, index) => {
                  return <p key={index}>{text}</p>;
                })}
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VersionList;
